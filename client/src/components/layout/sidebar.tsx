import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  FileCode,
  Search,
  Code,
  AlertTriangle,
  FileText,
  SeparatorHorizontal,
  PuzzleIcon,
  Clock,
} from "lucide-react";
import { useChat } from "@/hooks/use-chat";

interface SidebarProps {
  onToolSelect: (tool: string) => void;
  currentTool: string;
}

const Sidebar: FC<SidebarProps> = ({ onToolSelect, currentTool }) => {
  const [activeTab, setActiveTab] = useState("chat");
  const { clearMessages } = useChat();

  const handleNewSession = () => {
    clearMessages();
  };

  return (
    <div className="w-full lg:w-80 bg-dark-400 border-r border-dark-300 flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 border-b border-dark-300">
        <div className="flex items-center">
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm font-medium">Connected</span>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded"
            onClick={handleNewSession}
          >
            New Session
          </Button>
        </div>
      </div>

      {/* Tabs for Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full border-b border-dark-300"
      >
        <TabsList className="w-full justify-start bg-transparent border-b border-dark-300 rounded-none h-auto">
          <TabsTrigger
            value="chat"
            className="data-[state=active]:bg-dark-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none px-4 py-3 h-auto"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="data-[state=active]:bg-dark-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none px-4 py-3 h-auto"
          >
            Tools
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-dark-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-primary-500 rounded-none px-4 py-3 h-auto"
          >
            History
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Feature Navigation */}
      <div className="overflow-y-auto flex-1 p-3 space-y-1">
        <div className="text-xs uppercase text-gray-500 font-semibold ml-2 mt-2">
          Core Features
        </div>

        <Button
          variant={currentTool === "chat" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "chat" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("chat")}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Chat Assistant
        </Button>

        <Button
          variant={currentTool === "payload" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "payload" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("payload")}
        >
          <FileCode className="h-4 w-4 mr-2" />
          Payload Generator
        </Button>

        <Button
          variant={currentTool === "recon" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "recon" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("recon")}
        >
          <Search className="h-4 w-4 mr-2" />
          Recon Assistant
        </Button>

        <Button
          variant={currentTool === "request" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "request" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("request")}
        >
          <Code className="h-4 w-4 mr-2" />
          Request Analyzer
        </Button>

        <Button
          variant={currentTool === "vuln" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "vuln" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("vuln")}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Vuln Explainer
        </Button>

        <Button
          variant={currentTool === "report" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "report" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("report")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Bug Report Assistant
        </Button>

        <div className="text-xs uppercase text-gray-500 font-semibold ml-2 mt-4">
          Utilities
        </div>

        <Button
          variant={currentTool === "encoder" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "encoder" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("encoder")}
        >
          <SeparatorHorizontal className="h-4 w-4 mr-2" />
          Encoder/Decoder
        </Button>

        <Button
          variant={currentTool === "wordlist" ? "default" : "ghost"}
          className={`w-full justify-start text-left px-3 py-2 h-auto ${
            currentTool === "wordlist" ? "bg-primary-600 text-white" : ""
          }`}
          onClick={() => onToolSelect("wordlist")}
        >
          <PuzzleIcon className="h-4 w-4 mr-2" />
          Wordlist Generator
        </Button>
      </div>

      {/* Session Info */}
      <div className="p-3 border-t border-dark-300 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-400">Session: 0m</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 h-auto px-2 py-1"
          onClick={handleNewSession}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
