import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getResponseFromOpenAI } from "./services/openai";
import { 
  generateBasicXSSPayloads,
  generateSQLiPayloads,
  generateTemplateInjectionPayloads
} from "./utils/payloads";
import {
  encodeBase64,
  decodeBase64,
  encodeURL,
  decodeURL,
  encodeHTML,
  decodeHTML,
  toHex,
  fromHex
} from "./utils/encoders";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, metadata } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Get response from OpenAI
      const response = await getResponseFromOpenAI(message, metadata?.toolName);
      
      return res.json({ message: response });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      return res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // Encoder endpoints
  app.post("/api/encode", (req, res) => {
    try {
      const { text, type } = req.body;
      
      if (!text || !type) {
        return res.status(400).json({ error: "Text and encoding type are required" });
      }
      
      let result;
      switch (type) {
        case "base64":
          result = encodeBase64(text);
          break;
        case "url":
          result = encodeURL(text);
          break;
        case "html":
          result = encodeHTML(text);
          break;
        case "hex":
          result = toHex(text);
          break;
        default:
          return res.status(400).json({ error: "Invalid encoding type" });
      }
      
      return res.json({ result });
    } catch (error) {
      console.error("Error encoding text:", error);
      return res.status(500).json({ error: "Failed to encode text" });
    }
  });

  app.post("/api/decode", (req, res) => {
    try {
      const { text, type } = req.body;
      
      if (!text || !type) {
        return res.status(400).json({ error: "Text and decoding type are required" });
      }
      
      let result;
      switch (type) {
        case "base64":
          result = decodeBase64(text);
          break;
        case "url":
          result = decodeURL(text);
          break;
        case "html":
          result = decodeHTML(text);
          break;
        case "hex":
          result = fromHex(text);
          break;
        default:
          return res.status(400).json({ error: "Invalid decoding type" });
      }
      
      return res.json({ result });
    } catch (error) {
      console.error("Error decoding text:", error);
      return res.status(500).json({ error: "Failed to decode text" });
    }
  });

  // Payload endpoints
  app.post("/api/payloads", (req, res) => {
    try {
      const { type, variant, parameter } = req.body;
      
      if (!type || !variant) {
        return res.status(400).json({ error: "Payload type and variant are required" });
      }
      
      let payloads;
      switch (type) {
        case "xss":
          payloads = generateBasicXSSPayloads(variant, parameter);
          break;
        case "sqli":
          payloads = generateSQLiPayloads(variant, parameter);
          break;
        case "ssti":
          payloads = generateTemplateInjectionPayloads(variant, parameter);
          break;
        default:
          return res.status(400).json({ error: "Invalid payload type" });
      }
      
      return res.json({ payloads });
    } catch (error) {
      console.error("Error generating payloads:", error);
      return res.status(500).json({ error: "Failed to generate payloads" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
