import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useChat } from "@/hooks/use-chat";

interface BugReportProps {}

const BugReport: FC<BugReportProps> = () => {
  const [vulnTitle, setVulnTitle] = useState("");
  const [vulnType, setVulnType] = useState("");
  const [vulnDescription, setVulnDescription] = useState("");
  const [impactScore, setImpactScore] = useState([5]);
  const [steps, setSteps] = useState("");
  const [generating, setGenerating] = useState(false);
  const { sendMessage } = useChat();

  const vulnTypes = [
    { value: "xss", label: "Cross-Site Scripting (XSS)" },
    { value: "sqli", label: "SQL Injection" },
    { value: "rce", label: "Remote Code Execution" },
    { value: "ssrf", label: "Server-Side Request Forgery" },
    { value: "idor", label: "Insecure Direct Object References" },
    { value: "broken_auth", label: "Broken Authentication" },
    { value: "broken_authz", label: "Broken Authorization" },
    { value: "business_logic", label: "Business Logic" },
    { value: "csrf", label: "Cross-Site Request Forgery" },
    { value: "other", label: "Other" },
  ];

  const generateReport = async () => {
    if (!vulnTitle || !vulnType || !vulnDescription) return;
    
    setGenerating(true);
    
    try {
      const prompt = `Generate a professional vulnerability report in markdown format with the following details:

Title: ${vulnTitle}
Vulnerability Type: ${vulnTypes.find(v => v.value === vulnType)?.label}
Description: ${vulnDescription}
Impact Score: ${impactScore[0]}/10
Steps to Reproduce: ${steps || "Not provided"}

Include the following sections in the report:
1. Summary
2. Impact
3. Steps to Reproduce
4. Proof of Concept
5. Recommended Mitigation
6. References`;
      
      await sendMessage(prompt, {
        toolName: "report"
      });
    } catch (error) {
      console.error("Error generating bug report:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Bug Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Vulnerability Title
              </label>
              <Input
                value={vulnTitle}
                onChange={(e) => setVulnTitle(e.target.value)}
                placeholder="E.g., Stored XSS in User Profile"
                className="bg-dark-400 border-dark-300"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Vulnerability Type
              </label>
              <Select 
                value={vulnType} 
                onValueChange={setVulnType}
              >
                <SelectTrigger className="bg-dark-400 border-dark-300">
                  <SelectValue placeholder="Select vulnerability type" />
                </SelectTrigger>
                <SelectContent>
                  {vulnTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Brief Description
              </label>
              <Textarea
                value={vulnDescription}
                onChange={(e) => setVulnDescription(e.target.value)}
                placeholder="Briefly describe the vulnerability..."
                className="bg-dark-400 border-dark-300 text-gray-200 h-20"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Impact Score (1-10): {impactScore[0]}
              </label>
              <Slider
                value={impactScore}
                onValueChange={setImpactScore}
                max={10}
                min={1}
                step={1}
                className="py-4"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Steps to Reproduce (Optional)
              </label>
              <Textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="1. Go to...\n2. Click on...\n3. Enter..."
                className="bg-dark-400 border-dark-300 text-gray-200 h-20"
              />
            </div>
            
            <Button 
              onClick={generateReport} 
              disabled={!vulnTitle || !vulnType || !vulnDescription || generating}
              className="w-full"
            >
              {generating ? "Generating..." : "Generate Bug Report"}
            </Button>
            
            <p className="text-xs text-gray-500">
              The generator will produce a professional markdown-formatted report with all necessary sections for submitting to bug bounty programs or security teams.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BugReport;
