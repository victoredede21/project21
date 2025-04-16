import { FC, useState } from "react";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import ChatContainer from "@/components/layout/chat-container";

const Home: FC = () => {
  const [currentTool, setCurrentTool] = useState("chat");

  return (
    <div className="flex flex-col h-screen bg-dark-500 text-gray-100">
      <Header />
      
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <Sidebar onToolSelect={setCurrentTool} currentTool={currentTool} />
        <ChatContainer activeTool={currentTool} />
      </main>
    </div>
  );
};

export default Home;
