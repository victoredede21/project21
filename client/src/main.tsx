import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChatProvider } from "./context/chat-context";

createRoot(document.getElementById("root")!).render(
  <ChatProvider>
    <App />
  </ChatProvider>
);
