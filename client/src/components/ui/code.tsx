import { FC, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";

interface CodeProps {
  language?: string;
  value: string;
  label?: string;
  className?: string;
}

export const Code: FC<CodeProps> = ({
  language = "plaintext",
  value,
  label,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!codeRef.current) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code", error);
    }
  };

  return (
    <div className={cn("relative rounded-md overflow-hidden mb-4", className)}>
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-dark-400 border-b border-dark-300">
          <div className="text-sm font-medium text-gray-400">{label}</div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1 px-2 py-1 h-auto"
            onClick={handleCopy}
          >
            {isCopied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      )}
      <pre
        ref={codeRef}
        className={cn(
          "p-4 overflow-auto text-sm font-mono bg-dark-400 text-primary-300",
          !label && "rounded-md"
        )}
      >
        <code>{value}</code>
      </pre>
      {!label && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-md bg-dark-300 hover:bg-dark-200 text-gray-400 hover:text-gray-200 transition"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
};
