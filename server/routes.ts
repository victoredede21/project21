import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getResponseFromOpenAI } from "./services/openai";
import { 
  generateBasicXSSPayloads,
  generateSQLiPayloads,
  generateTemplateInjectionPayloads,
  generateCommandInjectionPayloads
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
import { insertAttackScenarioSchema, insertVulnerabilitySchema, insertAttackVectorSchema, insertScenarioVulnerabilitySchema } from "@shared/schema";

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
        case "cmd":
          payloads = generateCommandInjectionPayloads(variant);
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

  // Attack scenario routes
  app.post("/api/attack-scenarios", async (req, res) => {
    try {
      const parsedBody = insertAttackScenarioSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid attack scenario data" });
      }
      
      const scenario = await storage.createAttackScenario(parsedBody.data);
      return res.status(201).json(scenario);
    } catch (error) {
      console.error("Error creating attack scenario:", error);
      return res.status(500).json({ error: "Failed to create attack scenario" });
    }
  });

  app.get("/api/attack-scenarios", async (req, res) => {
    try {
      const scenarios = await storage.getAttackScenarios();
      return res.json(scenarios);
    } catch (error) {
      console.error("Error fetching attack scenarios:", error);
      return res.status(500).json({ error: "Failed to fetch attack scenarios" });
    }
  });

  app.get("/api/attack-scenarios/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid scenario ID" });
      }
      
      const scenario = await storage.getAttackScenarioById(id);
      if (!scenario) {
        return res.status(404).json({ error: "Attack scenario not found" });
      }
      
      return res.json(scenario);
    } catch (error) {
      console.error("Error fetching attack scenario:", error);
      return res.status(500).json({ error: "Failed to fetch attack scenario" });
    }
  });

  // Vulnerability routes
  app.post("/api/vulnerabilities", async (req, res) => {
    try {
      const parsedBody = insertVulnerabilitySchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid vulnerability data" });
      }
      
      const vulnerability = await storage.createVulnerability(parsedBody.data);
      return res.status(201).json(vulnerability);
    } catch (error) {
      console.error("Error creating vulnerability:", error);
      return res.status(500).json({ error: "Failed to create vulnerability" });
    }
  });

  app.get("/api/vulnerabilities", async (req, res) => {
    try {
      const vulnerabilities = await storage.getVulnerabilities();
      return res.json(vulnerabilities);
    } catch (error) {
      console.error("Error fetching vulnerabilities:", error);
      return res.status(500).json({ error: "Failed to fetch vulnerabilities" });
    }
  });

  // Attack vector routes
  app.post("/api/attack-vectors", async (req, res) => {
    try {
      const parsedBody = insertAttackVectorSchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid attack vector data" });
      }
      
      const vector = await storage.createAttackVector(parsedBody.data);
      return res.status(201).json(vector);
    } catch (error) {
      console.error("Error creating attack vector:", error);
      return res.status(500).json({ error: "Failed to create attack vector" });
    }
  });

  app.get("/api/attack-vectors", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const vectors = await storage.getAttackVectors(type);
      return res.json(vectors);
    } catch (error) {
      console.error("Error fetching attack vectors:", error);
      return res.status(500).json({ error: "Failed to fetch attack vectors" });
    }
  });

  // Scenario vulnerability linking
  app.post("/api/scenario-vulnerabilities", async (req, res) => {
    try {
      const parsedBody = insertScenarioVulnerabilitySchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid scenario vulnerability data" });
      }
      
      const link = await storage.linkVulnerabilityToScenario(parsedBody.data);
      return res.status(201).json(link);
    } catch (error) {
      console.error("Error linking vulnerability to scenario:", error);
      return res.status(500).json({ error: "Failed to link vulnerability to scenario" });
    }
  });

  app.get("/api/attack-scenarios/:id/vulnerabilities", async (req, res) => {
    try {
      const scenarioId = parseInt(req.params.id);
      if (isNaN(scenarioId)) {
        return res.status(400).json({ error: "Invalid scenario ID" });
      }
      
      const vulnerabilities = await storage.getVulnerabilitiesForScenario(scenarioId);
      return res.json(vulnerabilities);
    } catch (error) {
      console.error("Error fetching vulnerabilities for scenario:", error);
      return res.status(500).json({ error: "Failed to fetch vulnerabilities for scenario" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
