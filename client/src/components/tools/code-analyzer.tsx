import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  AlertCircle,
  Code,
  Loader,
  ShieldAlert,
  Search,
  FileJson,
  Copy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { extractCodeBlocks } from "@/lib/utils";

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

interface CodeAnalyzerProps {}

const CodeAnalyzer: React.FC<CodeAnalyzerProps> = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const analyzeWebsite = async () => {
    if (!url) {
      setError("Please enter a URL to analyze");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await apiRequest<AnalysisResult>("/api/analyze-code", {
        method: "POST",
        body: { url },
      });
      
      setAnalysisResult(response);
    } catch (error) {
      console.error("Error analyzing website:", error);
      setError("Failed to analyze website. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The payload has been copied to your clipboard.",
        });
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Source Code Analyzer
          </CardTitle>
          <CardDescription>
            Analyze websites for vulnerabilities in JavaScript code and HTML structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="url">Target Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="Enter a URL (e.g., example.com)"
                  value={url}
                  onChange={handleUrlChange}
                />
                <Button 
                  onClick={analyzeWebsite} 
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md">
          <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Analyzing website code...</p>
          <p className="text-sm text-muted-foreground">This might take a minute or two, especially for larger websites</p>
        </div>
      )}

      {analysisResult && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results: {analysisResult.url}</CardTitle>
              <CardDescription>
                {analysisResult.vulnerabilities.length > 0 
                  ? `Found ${analysisResult.vulnerabilities.length} potential vulnerabilities`
                  : "No vulnerabilities found"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="vulnerabilities">
                <TabsList className="mb-4">
                  <TabsTrigger value="vulnerabilities">
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    Vulnerabilities
                  </TabsTrigger>
                  <TabsTrigger value="scripts">
                    <Code className="h-4 w-4 mr-2" />
                    Scripts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="vulnerabilities" className="space-y-4">
                  {analysisResult.vulnerabilities.length === 0 ? (
                    <Alert>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <AlertDescription>
                        No vulnerabilities were detected in the analyzed source code.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Accordion type="multiple" className="space-y-2">
                      {analysisResult.vulnerabilities.map((vuln, index) => (
                        <AccordionItem 
                          key={index} 
                          value={`vuln-${index}`}
                          className={`border rounded-md p-2 ${getSeverityColor(vuln.severity)}`}
                        >
                          <AccordionTrigger className="hover:no-underline p-2">
                            <div className="flex items-center gap-2">
                              {getSeverityIcon(vuln.severity)}
                              <span className="font-medium">{vuln.type}</span>
                              <Badge variant={vuln.severity === 'critical' || vuln.severity === 'high' ? 'destructive' : 'outline'}>
                                {vuln.severity.toUpperCase()}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-2">
                            <div className="flex flex-col gap-3">
                              <div>
                                <h4 className="font-medium text-sm">Description</h4>
                                <p className="text-sm">{vuln.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm">Found In</h4>
                                <ScrollArea className="h-32 w-full rounded-md border my-2 p-2 bg-black/10">
                                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                                    {vuln.foundIn}
                                  </pre>
                                </ScrollArea>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-sm flex items-center gap-2">
                                  Suggested Payload
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(vuln.suggestedPayload)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </h4>
                                <ScrollArea className="h-20 w-full rounded-md border my-2 p-2 bg-black/10">
                                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                                    {vuln.suggestedPayload}
                                  </pre>
                                </ScrollArea>
                              </div>
                              
                              {vuln.remediation && (
                                <div>
                                  <h4 className="font-medium text-sm">Remediation</h4>
                                  <p className="text-sm">{vuln.remediation}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>

                <TabsContent value="scripts">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Inline Scripts ({analysisResult.extractedScripts.inline.length})</h3>
                      <Accordion type="multiple" className="space-y-2">
                        {analysisResult.extractedScripts.inline.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No inline scripts found</p>
                        ) : (
                          analysisResult.extractedScripts.inline.map((script, index) => (
                            <AccordionItem key={index} value={`inline-${index}`} className="border rounded-md">
                              <AccordionTrigger className="px-4">
                                <span className="font-medium">Inline Script #{index + 1}</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ScrollArea className="h-60 w-full rounded-md border my-2 bg-black/10">
                                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto p-4">
                                    {script.length > 5000 
                                      ? script.substring(0, 5000) + "\n... (truncated for display)" 
                                      : script}
                                  </pre>
                                </ScrollArea>
                              </AccordionContent>
                            </AccordionItem>
                          ))
                        )}
                      </Accordion>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2">External Scripts ({analysisResult.extractedScripts.external.length})</h3>
                      {analysisResult.extractedScripts.external.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No external scripts found</p>
                      ) : (
                        <ScrollArea className="h-40 w-full rounded-md border p-4">
                          <ul className="space-y-2">
                            {analysisResult.extractedScripts.external.map((script, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <FileJson className="h-4 w-4 text-muted-foreground" />
                                <span className="font-mono truncate">{script}</span>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  // Reset the analysis
                  setAnalysisResult(null);
                  setError(null);
                }}
              >
                New Analysis
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CodeAnalyzer;