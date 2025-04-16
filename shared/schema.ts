import { pgTable, text, serial, integer, boolean, timestamp, json, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  content: text("content").notNull(),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata"),
});

// Vulnerability status enum
export const vulnerabilityStatusEnum = pgEnum("vulnerability_status", [
  "unverified", 
  "confirmed", 
  "false_positive", 
  "fixed"
]);

// Severity level enum
export const severityLevelEnum = pgEnum("severity_level", [
  "info",
  "low", 
  "medium", 
  "high", 
  "critical"
]);

// Attack vectors table for storing common attack payloads
export const attackVectors = pgTable("attack_vectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // XSS, SQLi, SSRF, etc.
  description: text("description").notNull(),
  payloads: jsonb("payloads").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vulnerabilities table for storing vulnerability information
export const vulnerabilities = pgTable("vulnerabilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // Using text since pgEnum might not be created yet
  cve: text("cve"),
  remediation: text("remediation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Attack scenarios table for storing attack simulations
export const attackScenarios = pgTable("attack_scenarios", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  target: text("target").notNull(), // The website or system to test
  description: text("description").notNull(),
  status: text("status").default("created"),
  findings: jsonb("findings").$type<Record<string, any>>(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Linking table for scenarios and vulnerabilities
export const scenarioVulnerabilities = pgTable("scenario_vulnerabilities", {
  id: serial("id").primaryKey(),
  scenarioId: integer("scenario_id").notNull(),
  vulnerabilityId: integer("vulnerability_id").notNull(),
  status: text("status").default("unverified"), // Using text since pgEnum might not be created yet
  notes: text("notes"),
  proofOfConcept: text("proof_of_concept"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  content: true,
  role: true,
  metadata: true,
});

export const insertAttackScenarioSchema = createInsertSchema(attackScenarios).pick({
  name: true,
  target: true,
  description: true,
  userId: true,
});

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities).pick({
  name: true,
  description: true,
  severity: true,
  cve: true,
  remediation: true,
});

export const insertAttackVectorSchema = createInsertSchema(attackVectors).pick({
  name: true,
  type: true,
  description: true,
  payloads: true,
});

export const insertScenarioVulnerabilitySchema = createInsertSchema(scenarioVulnerabilities).pick({
  scenarioId: true,
  vulnerabilityId: true,
  status: true,
  notes: true,
  proofOfConcept: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertAttackScenario = z.infer<typeof insertAttackScenarioSchema>;
export type AttackScenario = typeof attackScenarios.$inferSelect;

export type InsertVulnerability = z.infer<typeof insertVulnerabilitySchema>;
export type Vulnerability = typeof vulnerabilities.$inferSelect;

export type InsertAttackVector = z.infer<typeof insertAttackVectorSchema>;
export type AttackVector = typeof attackVectors.$inferSelect;

export type InsertScenarioVulnerability = z.infer<typeof insertScenarioVulnerabilitySchema>;
export type ScenarioVulnerability = typeof scenarioVulnerabilities.$inferSelect;

export type ChatMessage = {
  id: string | number;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  metadata?: {
    toolName?: string;
    codeBlocks?: Array<{
      language: string;
      code: string;
      label?: string;
    }>;
  };
};
