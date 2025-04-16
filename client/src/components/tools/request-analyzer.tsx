import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/hooks/use-chat";

interface RequestAnalyzerProps {}

const RequestAnalyzer: FC<RequestAnalyzerProps> = () => {
  const [requestText, setRequestText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const { sendMessage } = useChat();

  const analyzeRequest = async () => {
    if (!requestText.trim()) return;
    
    setAnalyzing(true);
    try {
      await sendMessage(`Analyze this HTTP request or response for security issues:\n\n${requestText}`, {
        toolName: "request"
      });
    } catch (error) {
      console.error("Error analyzing request:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleRequests = [
    {
      name: "Basic GET Request",
      sample: `GET /search?q=test&debug=true HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Cookie: session=abc123; user=admin
Accept: text/html,application/xhtml+xml,application/xml`
    },
    {
      name: "Login POST Request",
      sample: `POST /login HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=admin&password=pass`
    },
    {
      name: "JSON API Request",
      sample: `POST /api/v1/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

{
  "name": "Test User",
  "email": "test@example.com",
  "role": "user"
}`
    }
  ];

  const loadSample = (sample: string) => {
    setRequestText(sample);
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">HTTP Request Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Paste HTTP Request or Response
              </label>
              <Textarea
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                placeholder="Paste HTTP request or response here..."
                className="bg-dark-400 border-dark-300 text-gray-200 h-64 font-mono text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-400 self-center mr-1">Examples:</span>
              {sampleRequests.map((req, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => loadSample(req.sample)}
                >
                  {req.name}
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={analyzeRequest} 
              disabled={analyzing || !requestText.trim()}
            >
              {analyzing ? "Analyzing..." : "Analyze Request"}
            </Button>
            
            <p className="text-xs text-gray-500">
              The analyzer will identify potential security issues including: injection points, missing headers, authentication issues, CSRF, CORS, and more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestAnalyzer;
