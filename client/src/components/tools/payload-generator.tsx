import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code } from "@/components/ui/code";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { useChat } from "@/hooks/use-chat";

interface PayloadGeneratorProps {}

const PayloadGenerator: FC<PayloadGeneratorProps> = () => {
  const [vulnType, setVulnType] = useState("xss");
  const [selectedVariant, setSelectedVariant] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState("");
  const [customParam, setCustomParam] = useState("");

  const { sendMessage } = useChat();

  const vulnTypes = [
    { value: "xss", label: "Cross-Site Scripting (XSS)" },
    { value: "sqli", label: "SQL Injection" },
    { value: "cmdi", label: "Command Injection" },
    { value: "ssti", label: "Server-Side Template Injection" },
    { value: "xxe", label: "XML External Entity (XXE)" },
  ];

  const vulnVariants = {
    xss: [
      { value: "basic", label: "Basic Alert" },
      { value: "dom", label: "DOM Based" },
      { value: "img", label: "Image Tag" },
      { value: "svg", label: "SVG" },
      { value: "event", label: "Event Handlers" },
      { value: "bypass", label: "WAF Bypass" },
    ],
    sqli: [
      { value: "union", label: "UNION Based" },
      { value: "error", label: "Error Based" },
      { value: "blind", label: "Blind" },
      { value: "time", label: "Time Based" },
      { value: "stacked", label: "Stacked Queries" },
    ],
    cmdi: [
      { value: "basic", label: "Basic" },
      { value: "blind", label: "Blind" },
      { value: "bypass", label: "Filter Bypass" },
    ],
    ssti: [
      { value: "jinja2", label: "Jinja2" },
      { value: "twig", label: "Twig" },
      { value: "velocity", label: "Velocity" },
      { value: "freemarker", label: "FreeMarker" },
    ],
    xxe: [
      { value: "basic", label: "Basic" },
      { value: "blind", label: "Blind XXE" },
      { value: "oob", label: "Out-of-band XXE" },
    ],
  };

  const generatePayload = async () => {
    setLoading(true);
    
    try {
      const query = `Generate a ${selectedVariant} ${vulnTypes.find(v => v.value === vulnType)?.label} payload${customParam ? ` with parameter ${customParam}` : ''}`;
      sendMessage(query, { toolName: "payload" });
      
      // Clear form
      setPayload("");
    } catch (error) {
      console.error("Error generating payload:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Payload Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-4">
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
                    Variant
                  </label>
                  <Select 
                    value={selectedVariant} 
                    onValueChange={setSelectedVariant}
                  >
                    <SelectTrigger className="bg-dark-400 border-dark-300">
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {vulnVariants[vulnType as keyof typeof vulnVariants]?.map((variant) => (
                        <SelectItem key={variant.value} value={variant.value}>
                          {variant.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">
                    Custom Parameter (Optional)
                  </label>
                  <Input
                    value={customParam}
                    onChange={(e) => setCustomParam(e.target.value)}
                    placeholder="E.g., cookie name, column count"
                    className="bg-dark-400 border-dark-300"
                  />
                </div>

                <Button 
                  onClick={generatePayload} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Generating..." : "Generate Payload"}
                </Button>
                
                <Alert variant="destructive" className="bg-transparent border-yellow-600 mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-warning text-xs">
                    Only use generated payloads on systems you are authorized to test. Unauthorized testing is illegal and unethical.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Payload
              </label>
              <div className="bg-dark-400 rounded-md border border-dark-300 overflow-hidden h-64 overflow-y-auto">
                {payload ? (
                  <Code value={payload} language="plaintext" />
                ) : (
                  <div className="p-4 text-gray-400 text-sm">
                    Generated payload will appear here. You can also ask in the chat for more specialized payloads.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayloadGenerator;
