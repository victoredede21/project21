import { FC, useState } from "react";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  value: string;
  variant?: "outline" | "ghost" | "default";
  size?: "sm" | "default";
  className?: string;
}

export const CopyButton: FC<CopyButtonProps> = ({
  value,
  variant = "ghost",
  size = "sm",
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text", error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCopy}
    >
      {isCopied ? (
        <>
          <Check className="h-3.5 w-3.5 mr-1" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 mr-1" />
          <span>Copy</span>
        </>
      )}
    </Button>
  );
};
