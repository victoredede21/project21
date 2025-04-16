import { FC, useEffect, useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ChatContainer from "@/components/layout/chat-container";
import { useLocation } from "wouter";

const Chat: FC = () => {
  const [currentTool, setCurrentTool] = useState("chat");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If the current tool is not chat, redirect to the tools page
    if (currentTool !== "chat") {
      setLocation("/tools");
    }
  }, [currentTool, setLocation]);

  const handleToolSelect = (tool: string) => {
    if (tool !== "chat") {
      setLocation("/tools");
    } else {
      setCurrentTool(tool);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-500 text-gray-100">
      <Header />
      
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar onToolSelect={handleToolSelect} currentTool={currentTool} />
        <ChatContainer activeTool="chat" />
      </main>
    </div>
  );
};

export default Chat;
