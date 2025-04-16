import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { PaperclipIcon, Camera, FileCode, ArrowDown, SendIcon } from "lucide-react";
import MessageItem from "@/components/chat/message-item";
import { useChat } from "@/hooks/use-chat";
import EncoderDecoder from "@/components/tools/encoder-decoder";
import PayloadGenerator from "@/components/tools/payload-generator";
import RequestAnalyzer from "@/components/tools/request-analyzer";
import VulnExplainer from "@/components/tools/vuln-explainer";
import ReconAssistant from "@/components/tools/recon-assistant";
import BugReport from "@/components/tools/bug-report";

interface ChatContainerProps {
  activeTool: string;
}

const ChatContainer: FC<ChatContainerProps> = ({ activeTool }) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useChat();

  const handleSubmit = async () => {
    if (inputValue.trim() === "" || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await sendMessage(inputValue, { toolName: activeTool });
      setInputValue("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case "encoder":
        return <EncoderDecoder />;
      case "payload":
        return <PayloadGenerator />;
      case "request":
        return <RequestAnalyzer />;
      case "vuln":
        return <VulnExplainer />;
      case "recon":
        return <ReconAssistant />;
      case "report":
        return <BugReport />;
      default:
        return null;
    }
  };

  const renderSuggestions = () => {
    const suggestions = [
      { text: "Generate XSS payload", tool: "payload" },
      { text: "Analyze this HTTP request", tool: "request" },
      { text: "Explain SSRF vulnerability", tool: "vuln" },
      { text: "Recon for example.com", tool: "recon" }
    ];

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="rounded-full px-3 py-1 h-auto text-xs bg-dark-300 hover:bg-dark-200 border-none"
            onClick={() => setInputValue(suggestion.text)}
          >
            {suggestion.text}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-start">
            <div className="rounded-full bg-primary-500 p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="bg-dark-400 rounded-lg p-4 max-w-4xl">
              <div className="font-medium mb-2">HackAssist AI</div>
              <p className="text-gray-300">
                Welcome to HackAssist AI - your cybersecurity assistant. I can help with payload generation, vulnerability explanation, reconnaissance, request analysis, and more. How can I assist you today?
              </p>
              {renderSuggestions()}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Tools Panel */}
      {renderToolContent()}

      {/* Input Area */}
      <div className="border-t border-dark-300 p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <PaperclipIcon className="h-4 w-4 mr-1" />
              <span>Attach</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <Camera className="h-4 w-4 mr-1" />
              <span>Screenshot</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <FileCode className="h-4 w-4 mr-1" />
              <span>Code Block</span>
            </Button>
          </div>

          <div className="relative">
            <Textarea
              id="message-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI assistant..."
              className="w-full bg-dark-400 border border-dark-300 rounded-lg pl-4 pr-24 py-3 text-sm text-gray-200 focus:outline-none focus:border-primary-500 min-h-[80px]"
            />
            <div className="absolute right-3 bottom-3 flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto" 
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting || inputValue.trim() === ""}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-md px-3 py-1 text-sm font-medium h-auto"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>

          <Alert variant="default" className="bg-transparent text-xs text-gray-500 p-0 border-none">
            HackAssist AI is designed for ethical security research. Always obtain proper authorization before testing.
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
