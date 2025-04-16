import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimestamp } from "@/lib/utils";
import { type ChatMessage } from "@shared/schema";
import CodeBlock from "./code-block";
import { Lock, User } from "lucide-react";

interface MessageItemProps {
  message: ChatMessage;
}

const MessageItem: FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === "user";

  // Process content for code blocks
  const renderContent = () => {
    if (message.metadata?.codeBlocks && message.metadata.codeBlocks.length > 0) {
      // Split content by code block markers and then render
      const codeBlockMarker = "```";
      let parts = message.content.split(codeBlockMarker);
      
      if (parts.length === 1) {
        // No code blocks in content, just render the message
        return <p className="text-gray-300">{message.content}</p>;
      }
      
      // Process alternating text and code blocks
      return (
        <>
          {parts.map((part, index) => {
            // Even indexes are text
            if (index % 2 === 0) {
              return part ? <p key={index} className="text-gray-300 mb-3">{part}</p> : null;
            } 
            // Odd indexes are code blocks
            else {
              const codeBlockIndex = Math.floor(index / 2);
              const codeBlock = message.metadata?.codeBlocks?.[codeBlockIndex];
              if (!codeBlock) return null;
              
              return (
                <CodeBlock
                  key={index}
                  language={codeBlock.language}
                  code={codeBlock.code}
                  label={codeBlock.label}
                />
              );
            }
          })}
        </>
      );
    }
    
    // No code blocks, just render the message
    return <p className={isUser ? "text-gray-100" : "text-gray-300"}>{message.content}</p>;
  };

  return (
    <div className={`flex items-start ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="rounded-full bg-primary-500 p-2 mr-4">
          <Lock className="h-6 w-6 text-white" />
        </div>
      )}
      
      <div className={`rounded-lg p-4 max-w-4xl ${isUser ? "bg-primary-600" : "bg-dark-400"}`}>
        <div className="font-medium mb-2">{isUser ? "You" : "HackAssist AI"}</div>
        {renderContent()}
      </div>
      
      {isUser && (
        <Avatar className="h-10 w-10 ml-4 bg-gray-500">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-500 text-white">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem;
