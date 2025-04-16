import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Code } from "@/components/ui/code";

interface CodeBlockProps {
  language: string;
  code: string;
  label?: string;
}

const CodeBlock: FC<CodeBlockProps> = ({ language, code, label }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code", error);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium text-gray-400">
          {label || language.charAt(0).toUpperCase() + language.slice(1)} 
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy}
          className="text-xs bg-dark-300 hover:bg-dark-200 rounded px-2 py-1 h-auto flex items-center"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      
      <Code value={code} language={language} />
    </div>
  );
};

export default CodeBlock;
