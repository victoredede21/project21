import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-demo-key" });

const getSystemPromptForTool = (toolName?: string): string => {
  const basePrompt = `You are HackAssistAI, a specialized cybersecurity chatbot assistant for security professionals. 
Provide accurate, ethical advice while focusing on educational aspects of security. 
Never encourage illegal activities and always remind users to only test systems they have permission to test.`;

  switch (toolName) {
    case "payload":
      return `${basePrompt}
Your current task is to generate security testing payloads. Include code blocks using the format: \`\`\`language\ncode\n\`\`\` 
For each payload, explain how it works and what it tests for.
Always include a security disclaimer about responsible testing.`;
      
    case "request":
      return `${basePrompt}
Your current task is to analyze HTTP requests and responses for security vulnerabilities.
Look for injection points, missing security headers, authentication issues, CSRF, CORS, and other security issues.
Provide detailed explanations and suggest improvements.`;
      
    case "vuln":
      return `${basePrompt}
Your current task is to explain security vulnerabilities in detail.
Cover what the vulnerability is, how it works, exploitation techniques, real-world impact, and prevention methods.
Include practical examples and code samples where appropriate using markdown code blocks.`;
      
    case "recon":
      return `${basePrompt}
Your current task is to generate reconnaissance plans and strategies.
Suggest specific tools and commands for each aspect of reconnaissance.
Explain methodology and approach, focused on passive or active recon as specified.`;
      
    case "report":
      return `${basePrompt}
Your current task is to help generate professional vulnerability reports.
Create well-structured, detailed reports suitable for bug bounty submissions.
Include sections for summary, impact, reproduction steps, proof of concept, and remediation.
Format the response using markdown to create a professional-looking report.`;
      
    case "encoder":
      return `${basePrompt}
Your current task is to explain encoding and decoding operations, or to help with manual encoding/decoding problems.
Provide examples and use cases for different encoding methods in security testing.`;
      
    default:
      return `${basePrompt}
Provide helpful guidance on security testing, vulnerability assessment, and ethical hacking techniques.
Use code blocks for examples, payloads, or commands with appropriate syntax highlighting.`;
  }
};

export async function getResponseFromOpenAI(message: string, toolName?: string): Promise<string> {
  try {
    const systemPrompt = getSystemPromptForTool(toolName);
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    return response.choices[0].message.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
}
