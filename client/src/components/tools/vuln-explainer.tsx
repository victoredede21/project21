import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChat } from "@/hooks/use-chat";

interface VulnExplainerProps {}

const VulnExplainer: FC<VulnExplainerProps> = () => {
  const [selectedVuln, setSelectedVuln] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendMessage } = useChat();

  const vulnTypes = [
    { value: "xss", label: "Cross-Site Scripting (XSS)" },
    { value: "sqli", label: "SQL Injection" },
    { value: "cmdi", label: "Command Injection" },
    { value: "ssrf", label: "Server-Side Request Forgery (SSRF)" },
    { value: "idor", label: "Insecure Direct Object References (IDOR)" },
    { value: "xxe", label: "XML External Entity (XXE)" },
    { value: "ssti", label: "Server-Side Template Injection" },
    { value: "csrf", label: "Cross-Site Request Forgery (CSRF)" },
    { value: "deserialization", label: "Insecure Deserialization" },
    { value: "jwt", label: "JWT Vulnerabilities" },
    { value: "oauth", label: "OAuth 2.0 Vulnerabilities" },
    { value: "fileupload", label: "File Upload Vulnerabilities" },
    { value: "lfi", label: "Local File Inclusion" },
    { value: "rfi", label: "Remote File Inclusion" },
    { value: "authz", label: "Broken Authorization" },
    { value: "authn", label: "Broken Authentication" },
    { value: "caching", label: "Caching Issues" },
    { value: "cors", label: "CORS Misconfigurations" }
  ];

  const explainVulnerability = async () => {
    if (!selectedVuln) return;
    
    setLoading(true);
    const vulnLabel = vulnTypes.find(v => v.value === selectedVuln)?.label;
    
    try {
      await sendMessage(`Explain the ${vulnLabel} vulnerability in detail including:
1. What it is
2. How it works
3. How to exploit it
4. Real-world impact
5. How to prevent it
6. Examples of payloads or attacks`, {
        toolName: "vuln"
      });
    } catch (error) {
      console.error("Error fetching vulnerability explanation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Vulnerability Explainer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Select Vulnerability
              </label>
              <Select 
                value={selectedVuln} 
                onValueChange={setSelectedVuln}
              >
                <SelectTrigger className="bg-dark-400 border-dark-300">
                  <SelectValue placeholder="Choose a vulnerability" />
                </SelectTrigger>
                <SelectContent>
                  {vulnTypes.map((vuln) => (
                    <SelectItem key={vuln.value} value={vuln.value}>
                      {vuln.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={explainVulnerability}
                disabled={!selectedVuln || loading}
                className="flex-1"
              >
                {loading ? "Loading..." : "Explain Vulnerability"}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedVuln) {
                    const vulnLabel = vulnTypes.find(v => v.value === selectedVuln)?.label;
                    sendMessage(`Show me real-world examples of ${vulnLabel} that have been reported in bug bounty programs`, {
                      toolName: "vuln"
                    });
                  }
                }}
                disabled={!selectedVuln || loading}
              >
                Show Bug Bounty Examples
              </Button>
            </div>
            
            <p className="text-xs text-gray-500">
              The explanations include detailed information about vulnerability mechanics, exploitation techniques, impact assessment, and prevention methods. You can also ask follow-up questions in the chat.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VulnExplainer;
