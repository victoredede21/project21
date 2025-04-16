import { 
  users, type User, type InsertUser,
  messages, type Message, type InsertMessage, 
  chatSessions, type ChatSession, type InsertChatSession,
  attackScenarios, type AttackScenario, type InsertAttackScenario,
  vulnerabilities, type Vulnerability, type InsertVulnerability,
  attackVectors, type AttackVector, type InsertAttackVector,
  scenarioVulnerabilities, type ScenarioVulnerability, type InsertScenarioVulnerability
} from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface defining storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat session methods
  getChatSession(id: number): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSessionsByUserId(userId: number): Promise<ChatSession[]>;
  
  // Message methods
  getMessages(sessionId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessageById(id: number): Promise<Message | undefined>;
  
  // Attack scenario methods
  createAttackScenario(scenario: InsertAttackScenario): Promise<AttackScenario>;
  getAttackScenarios(): Promise<AttackScenario[]>;
  getAttackScenarioById(id: number): Promise<AttackScenario | undefined>;
  
  // Vulnerability methods
  createVulnerability(vulnerability: InsertVulnerability): Promise<Vulnerability>;
  getVulnerabilities(): Promise<Vulnerability[]>;
  
  // Attack vector methods
  createAttackVector(vector: InsertAttackVector): Promise<AttackVector>;
  getAttackVectors(type?: string): Promise<AttackVector[]>;
  
  // Scenario vulnerability linking
  linkVulnerabilityToScenario(link: InsertScenarioVulnerability): Promise<ScenarioVulnerability>;
  getVulnerabilitiesForScenario(scenarioId: number): Promise<(Vulnerability & { status: string, notes?: string, poc?: string })[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }
  
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values({
        ...insertSession,
        createdAt: new Date()
      })
      .returning();
    return session;
  }
  
  async getChatSessionsByUserId(userId: number): Promise<ChatSession[]> {
    return await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.createdAt));
  }
  
  async getMessages(sessionId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.timestamp);
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    // Create a new message without the timestamp field
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message || undefined;
  }
  
  // Attack scenario methods
  async createAttackScenario(insertScenario: InsertAttackScenario): Promise<AttackScenario> {
    const [scenario] = await db
      .insert(attackScenarios)
      .values({
        ...insertScenario,
        status: 'created',
        findings: {},
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return scenario;
  }
  
  async getAttackScenarios(): Promise<AttackScenario[]> {
    return await db.select()
      .from(attackScenarios)
      .orderBy(desc(attackScenarios.createdAt));
  }
  
  async getAttackScenarioById(id: number): Promise<AttackScenario | undefined> {
    const [scenario] = await db.select().from(attackScenarios).where(eq(attackScenarios.id, id));
    return scenario || undefined;
  }
  
  // Vulnerability methods
  async createVulnerability(insertVuln: InsertVulnerability): Promise<Vulnerability> {
    const [vuln] = await db
      .insert(vulnerabilities)
      .values(insertVuln)
      .returning();
    return vuln;
  }
  
  async getVulnerabilities(): Promise<Vulnerability[]> {
    return await db.select().from(vulnerabilities);
  }
  
  // Attack vector methods
  async createAttackVector(insertVector: InsertAttackVector): Promise<AttackVector> {
    const [vector] = await db
      .insert(attackVectors)
      .values(insertVector)
      .returning();
    return vector;
  }
  
  async getAttackVectors(type?: string): Promise<AttackVector[]> {
    if (type) {
      return await db.select()
        .from(attackVectors)
        .where(eq(attackVectors.type, type));
    }
    return await db.select().from(attackVectors);
  }
  
  // Scenario vulnerability linking
  async linkVulnerabilityToScenario(insertLink: InsertScenarioVulnerability): Promise<ScenarioVulnerability> {
    const [link] = await db
      .insert(scenarioVulnerabilities)
      .values(insertLink)
      .returning();
    return link;
  }
  
  async getVulnerabilitiesForScenario(scenarioId: number): Promise<(Vulnerability & { status: string, notes?: string, poc?: string })[]> {
    // Join the vulnerabilities with the scenario_vulnerabilities table
    const results = await db
      .select({
        id: vulnerabilities.id,
        name: vulnerabilities.name,
        description: vulnerabilities.description,
        severity: vulnerabilities.severity,
        cve: vulnerabilities.cve,
        remediation: vulnerabilities.remediation,
        status: scenarioVulnerabilities.status,
        notes: scenarioVulnerabilities.notes,
        poc: scenarioVulnerabilities.proofOfConcept
      })
      .from(vulnerabilities)
      .innerJoin(
        scenarioVulnerabilities,
        eq(vulnerabilities.id, scenarioVulnerabilities.vulnerabilityId)
      )
      .where(eq(scenarioVulnerabilities.scenarioId, scenarioId));
      
    return results;
  }
}

export const storage = new DatabaseStorage();
