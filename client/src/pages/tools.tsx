import { FC, useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ChatContainer from "@/components/layout/chat-container";
import { useLocation } from "wouter";

const validTools = [
  "payload", 
  "recon", 
  "request", 
  "vuln", 
  "report", 
  "encoder", 
  "wordlist"
];

const Tools: FC = () => {
  const [currentTool, setCurrentTool] = useState("payload");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If the current tool is chat, redirect to the chat page
    if (currentTool === "chat") {
      setLocation("/");
    }
  }, [currentTool, setLocation]);

  const handleToolSelect = (tool: string) => {
    if (tool === "chat") {
      setLocation("/");
    } else if (validTools.includes(tool)) {
      setCurrentTool(tool);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-500 text-gray-100">
      <Header />
      
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar onToolSelect={handleToolSelect} currentTool={currentTool} />
        <ChatContainer activeTool={currentTool} />
      </main>
    </div>
  );
};

export default Tools;
