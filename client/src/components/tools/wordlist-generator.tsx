import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/ui/copy-button";
import { useChat } from "@/hooks/use-chat";

interface WordlistGeneratorProps {}

const WordlistGenerator: FC<WordlistGeneratorProps> = () => {
  const [input, setInput] = useState("");
  const [wordlistType, setWordlistType] = useState("subdomain");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [wordlist, setWordlist] = useState<string[]>([]);
  const { sendMessage } = useChat();
  
  const wordlistTypes = [
    { value: "subdomain", label: "Subdomains" },
    { value: "endpoint", label: "Endpoints/Directories" },
    { value: "parameter", label: "Parameters" },
    { value: "custom", label: "Custom" },
  ];

  const generateWordlist = async () => {
    if (!input) return;
    
    setGenerating(true);
    
    try {
      const promptContext = 
        wordlistType === "subdomain" ? "create a wordlist of potential subdomains for" :
        wordlistType === "endpoint" ? "create a wordlist of potential endpoints, directories and files for" :
        wordlistType === "parameter" ? "create a wordlist of potential parameters for" :
        "create a custom wordlist for security testing of";
      
      const techContext = additionalContext ? 
        `Consider that the target uses these technologies: ${additionalContext}` : "";
      
      const prompt = `Please ${promptContext} ${input}. ${techContext}
      
Format the wordlist as a simple list with one item per line. 
Include at least 20 entries that would be valuable for security testing. 
Focus on security-sensitive endpoints/paths if applicable.`;
      
      await sendMessage(prompt, {
        toolName: "wordlist"
      });
    } catch (error) {
      console.error("Error generating wordlist:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-dark-400 border-t border-dark-300 p-4">
      <Card className="bg-dark-300 border-dark-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium">Wordlist Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Target Domain or URL
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="example.com"
                  className="bg-dark-400 border-dark-300"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Wordlist Type
                </label>
                <Select 
                  value={wordlistType} 
                  onValueChange={setWordlistType}
                >
                  <SelectTrigger className="bg-dark-400 border-dark-300">
                    <SelectValue placeholder="Select wordlist type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wordlistTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">
                  Technology Stack (Optional)
                </label>
                <Input
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="PHP, WordPress, etc."
                  className="bg-dark-400 border-dark-300"
                />
              </div>
              
              <Button 
                onClick={generateWordlist} 
                disabled={!input || generating}
                className="w-full"
              >
                {generating ? "Generating..." : "Generate Wordlist"}
              </Button>
              
              <div className="text-xs text-gray-500">
                This tool generates contextual wordlists for security testing purposes. 
                Wordlists can be used with tools like ffuf, gobuster, or wfuzz for discovery.
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-300">
                  Generated Wordlist
                </label>
                {wordlist.length > 0 && (
                  <CopyButton value={wordlist.join('\n')} />
                )}
              </div>
              <Textarea
                value={wordlist.join('\n')}
                readOnly
                className="bg-dark-400 border-dark-300 text-gray-200 h-64 font-mono text-sm"
                placeholder="Generated wordlist will appear here..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordlistGenerator;
