import { createContext, useCallback, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { type ChatMessage } from "@shared/schema";
import { extractCodeBlocks } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string, metadata?: any) => Promise<void>;
  clearMessages: () => void;
  loading: boolean;
}

export const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: async () => {},
  clearMessages: () => {},
  loading: false,
});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (content: string, metadata: any = {}) => {
    setLoading(true);
    
    try {
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        role: "user",
        timestamp: new Date(),
        metadata
      };
      
      setMessages((prev) => [...prev, userMessage]);
      
      // Send to API
      const response = await apiRequest("POST", "/api/chat", {
        message: content,
        metadata
      });
      
      const data = await response.json();
      
      // Process response for code blocks
      const codeBlocks = extractCodeBlocks(data.message);
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
        metadata: {
          ...metadata,
          codeBlocks
        }
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: "Sorry, there was an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
        metadata: { error: true }
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        clearMessages,
        loading
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
