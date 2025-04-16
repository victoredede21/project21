import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useChat } from "@/hooks/use-chat";

interface ReconAssistantProps {}

const ReconAssistant: FC<ReconAssistantProps> = () => {
  const [domain, setDomain] = useState("");
  const [activeTab, setActiveTab] = useState("passive");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    subdomains: true,
    ports: true,
    techstack: true,
    github: true,
    endpoints: true
  });
  const { sendMessage } = useChat();

  const handleCheckboxChange = (field: keyof typeof options) => (checked: CheckedState) => {
    setOptions(prev => ({
      ...prev,
      [field]: checked === true
    }));
  };

  const generateReconPlan = async () => {
    if (!domain) return;
    
    setLoading(true);
    
    try {
      const selectedOptions = Object.entries(options)
        .filter(([_, enabled]) => enabled)
        .map(([option]) => option)
        .join(", ");
      
      const prompt = `Generate a ${activeTab} reconnaissance plan for the domain ${domain}.
Include the following aspects: ${selectedOptions}.
For each aspect, suggest specific tools and commands that could be used.
If applicable, explain the methodology and approach for this reconnaissance.`;
      
      await sendMessage(prompt, {
        toolName: "recon"
      });
    } catch (error) {
      console.error("Error generating recon plan:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Reconnaissance Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Target Domain
              </label>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                className="bg-dark-400 border-dark-300"
              />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="passive">Passive Recon</TabsTrigger>
                <TabsTrigger value="active">Active Recon</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 block">
                Reconnaissance Options
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="subdomains" 
                    checked={options.subdomains}
                    onCheckedChange={handleCheckboxChange("subdomains")}
                  />
                  <label
                    htmlFor="subdomains"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Subdomains
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ports" 
                    checked={options.ports}
                    onCheckedChange={handleCheckboxChange("ports")}
                  />
                  <label
                    htmlFor="ports"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Open Ports / Services
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="techstack" 
                    checked={options.techstack}
                    onCheckedChange={handleCheckboxChange("techstack")}
                  />
                  <label
                    htmlFor="techstack"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Technology Stack
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="github" 
                    checked={options.github}
                    onCheckedChange={handleCheckboxChange("github")}
                  />
                  <label
                    htmlFor="github"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    GitHub/Source Code
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="endpoints" 
                    checked={options.endpoints}
                    onCheckedChange={handleCheckboxChange("endpoints")}
                  />
                  <label
                    htmlFor="endpoints"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Endpoints / Directories
                  </label>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={generateReconPlan} 
              disabled={!domain || loading}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Recon Plan"}
            </Button>
            
            <p className="text-xs text-gray-500">
              The assistant will suggest tools, commands, and methodologies based on your selected reconnaissance type and options. Results will appear in the chat.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReconAssistant;
