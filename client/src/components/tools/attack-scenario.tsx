import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/use-chat";
import { apiRequest } from "@/lib/queryClient";

interface AttackScenario {
  id: number;
  name: string;
  target: string;
  description: string;
  status: string;
  findings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface Vulnerability {
  id: number;
  name: string;
  description: string;
  severity: string;
  cve: string | null;
  remediation: string | null;
  status?: string;
  notes?: string;
  poc?: string;
}

interface AttackScenarioProps {}

const AttackScenario: FC<AttackScenarioProps> = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [scenarios, setScenarios] = useState<AttackScenario[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario | null>(null);

  // Form states
  const [scenarioName, setScenarioName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);

  const { toast } = useToast();
  const { sendMessage } = useChat();

  // Fetch scenarios on tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "view" && scenarios.length === 0) {
      fetchScenarios();
    }
  };

  // Fetch all attack scenarios
  const fetchScenarios = async () => {
    setIsLoadingScenarios(true);
    try {
      const response = await apiRequest({
        url: "/api/attack-scenarios",
        method: "GET",
      });
      setScenarios(response as AttackScenario[]);
    } catch (error) {
      console.error("Error fetching attack scenarios:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attack scenarios",
        variant: "destructive",
      });
    } finally {
      setIsLoadingScenarios(false);
    }
  };

  // Fetch vulnerabilities for a specific scenario
  const fetchVulnerabilities = async (scenarioId: number) => {
    try {
      const response = await apiRequest({
        url: `/api/attack-scenarios/${scenarioId}/vulnerabilities`,
        method: "GET",
      });
      setVulnerabilities(response as Vulnerability[]);
    } catch (error) {
      console.error("Error fetching vulnerabilities:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vulnerabilities for this scenario",
        variant: "destructive",
      });
    }
  };

  // Select a scenario to view details
  const handleSelectScenario = async (scenario: AttackScenario) => {
    setSelectedScenario(scenario);
    await fetchVulnerabilities(scenario.id);
  };

  // Create a new attack scenario
  const createScenario = async () => {
    if (!scenarioName || !targetUrl || !description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newScenario = await apiRequest({
        url: "/api/attack-scenarios",
        method: "POST",
        data: {
          name: scenarioName,
          target: targetUrl,
          description,
        },
      });
      
      // Ask OpenAI to analyze the target
      const prompt = `Analyze the website ${targetUrl} for security vulnerabilities. 
Create a comprehensive security assessment considering:
1. Common vulnerabilities for this type of site
2. Potential attack vectors
3. Recommended testing approach
4. Security best practices
Format as a structured security assessment with clear headings and sections. Include specific details that would help a security researcher test the site.`;
      
      await sendMessage(prompt, { toolName: "scenario" });

      toast({
        title: "Success",
        description: "Attack scenario created successfully",
      });
      
      // Reset form
      setScenarioName("");
      setTargetUrl("");
      setDescription("");
      
      // Switch to view tab
      setActiveTab("view");
      fetchScenarios();
    } catch (error) {
      console.error("Error creating attack scenario:", error);
      toast({
        title: "Error",
        description: "Failed to create attack scenario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-600 hover:bg-red-700";
      case "high":
        return "bg-orange-600 hover:bg-orange-700";
      case "medium":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "low":
        return "bg-blue-600 hover:bg-blue-700";
      case "info":
        return "bg-gray-600 hover:bg-gray-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-600 hover:bg-green-700";
      case "unverified":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "false_positive":
        return "bg-gray-600 hover:bg-gray-700";
      case "fixed":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Attack Scenario Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              <TabsTrigger value="create">Create Scenario</TabsTrigger>
              <TabsTrigger value="view">View Scenarios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input
                    id="scenario-name"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="My Security Test"
                    className="bg-dark-400 border-dark-300 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="target-url">Target URL</Label>
                  <Input
                    id="target-url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-dark-400 border-dark-300 mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose of this security test..."
                    className="bg-dark-400 border-dark-300 mt-1 min-h-[100px]"
                  />
                </div>
                
                <Button 
                  onClick={createScenario} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Creating..." : "Create Attack Scenario"}
                </Button>
                
                <div className="text-xs text-gray-400 mt-2">
                  Creating an attack scenario will initiate a security analysis of the target URL using AI.
                  This helps identify potential vulnerabilities and attack vectors for security testing.
                  <span className="text-red-400 font-semibold block mt-1">
                    Only test websites you own or have permission to test.
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="view">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Scenarios List */}
                <div className="md:col-span-1 border border-dark-300 rounded-md p-3 bg-dark-400 overflow-auto max-h-[400px]">
                  <h3 className="text-sm font-medium mb-2">Scenarios</h3>
                  
                  {isLoadingScenarios ? (
                    <div className="text-sm text-gray-400">Loading scenarios...</div>
                  ) : scenarios.length === 0 ? (
                    <div className="text-sm text-gray-400">No scenarios found</div>
                  ) : (
                    <div className="space-y-2">
                      {scenarios.map((scenario) => (
                        <div
                          key={scenario.id}
                          onClick={() => handleSelectScenario(scenario)}
                          className={`cursor-pointer p-2 rounded-md ${
                            selectedScenario?.id === scenario.id
                              ? "bg-dark-300 border border-primary-500"
                              : "bg-dark-400 hover:bg-dark-300 border border-dark-300"
                          }`}
                        >
                          <div className="font-medium text-sm">{scenario.name}</div>
                          <div className="text-xs text-gray-400 truncate">{scenario.target}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {scenario.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {new Date(scenario.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Scenario Details */}
                <div className="md:col-span-2 border border-dark-300 rounded-md p-3 bg-dark-400 overflow-auto max-h-[400px]">
                  {selectedScenario ? (
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-sm font-medium">{selectedScenario.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {selectedScenario.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Target URL</div>
                        <div className="text-sm break-all">{selectedScenario.target}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Description</div>
                        <div className="text-sm whitespace-pre-wrap">{selectedScenario.description}</div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-400 mb-1">Created</div>
                        <div className="text-sm">
                          {new Date(selectedScenario.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="border-t border-dark-300 pt-3 mt-3">
                        <h4 className="text-sm font-medium mb-2">Vulnerabilities</h4>
                        
                        {vulnerabilities.length === 0 ? (
                          <div className="text-sm text-gray-400">No vulnerabilities found yet</div>
                        ) : (
                          <div className="space-y-2">
                            {vulnerabilities.map((vuln) => (
                              <div
                                key={vuln.id}
                                className="p-2 rounded-md bg-dark-300 border border-dark-200"
                              >
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium text-sm">{vuln.name}</h5>
                                  <div className="flex gap-1">
                                    {vuln.status && (
                                      <Badge className={`text-xs ${getStatusColor(vuln.status)}`}>
                                        {vuln.status}
                                      </Badge>
                                    )}
                                    <Badge className={`text-xs ${getSeverityColor(vuln.severity)}`}>
                                      {vuln.severity}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1">{vuln.description}</div>
                                {vuln.notes && (
                                  <div className="mt-2 text-xs">
                                    <span className="text-gray-400">Notes: </span>
                                    {vuln.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 h-full flex items-center justify-center">
                      Select a scenario to view details
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttackScenario;