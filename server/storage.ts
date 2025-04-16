import { users, type User, type InsertUser, insertMessageSchema, messages, type Message, type InsertMessage, chatSessions, type ChatSession, type InsertChatSession } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// modify the interface with any CRUD methods
// you might need

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatSessions: Map<number, ChatSession>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }
  
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentSessionId++;
    const session: ChatSession = { 
      ...insertSession, 
      id, 
      createdAt: new Date() 
    };
    this.chatSessions.set(id, session);
    return session;
  }
  
  async getChatSessionsByUserId(userId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId);
  }
  
  async getMessages(sessionId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: insertMessage.timestamp || new Date()
    };
    this.messages.set(id, message);
    return message;
  }
  
  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
}

export const storage = new MemStorage();
