import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Encoder/Decoder utility functions
export function encodeBase64(input: string): string {
  try {
    return btoa(input);
  } catch (error) {
    console.error("Error encoding to Base64:", error);
    return "";
  }
}

export function decodeBase64(input: string): string {
  try {
    return atob(input);
  } catch (error) {
    console.error("Error decoding from Base64:", error);
    return "";
  }
}

export function encodeURL(input: string): string {
  try {
    return encodeURIComponent(input);
  } catch (error) {
    console.error("Error encoding URL:", error);
    return "";
  }
}

export function decodeURL(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch (error) {
    console.error("Error decoding URL:", error);
    return "";
  }
}

export function encodeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function decodeHTML(input: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

export function toHex(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += input.charCodeAt(i).toString(16);
  }
  return result;
}

export function fromHex(input: string): string {
  const hex = input.toString();
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const hexChar = hex.substr(i, 2);
    const charCode = parseInt(hexChar, 16);
    if (!isNaN(charCode)) {
      result += String.fromCharCode(charCode);
    }
  }
  return result;
}

// Format timestamps into readable format
export function formatTimestamp(timestamp: Date | string | number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Extract code blocks from markdown-like text
export function extractCodeBlocks(text: string): Array<{ language: string; code: string; label?: string }> {
  const codeBlockRegex = /```([a-zA-Z0-9]*)(?: "([^"]*)")?\n([\s\S]*?)```/g;
  const codeBlocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const [, language, label, code] = match;
    codeBlocks.push({
      language: language || "plaintext",
      code: code.trim(),
      label: label || undefined,
    });
  }
  
  return codeBlocks;
}

// Parse user messages for commands
export const parseUserMessage = (message: string) => {
  // Check if message is a command
  if (message.startsWith('/')) {
    const [command, ...args] = message.slice(1).split(' ');
    return {
      isCommand: true,
      command,
      args: args.join(' '),
      originalMessage: message
    };
  }
  
  return {
    isCommand: false,
    originalMessage: message
  };
};
