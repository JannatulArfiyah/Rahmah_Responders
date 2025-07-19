import { users, emergencyCases, type User, type InsertUser, type EmergencyCase, type InsertEmergencyCase } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Emergency cases methods
  getAllEmergencyCases(): Promise<EmergencyCase[]>;
  getEmergencyCase(id: number): Promise<EmergencyCase | undefined>;
  createEmergencyCase(emergencyCase: InsertEmergencyCase): Promise<EmergencyCase>;
  updateEmergencyCaseStatus(id: number, status: string): Promise<EmergencyCase | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyCases: Map<number, EmergencyCase>;
  private currentUserId: number;
  private currentEmergencyCaseId: number;

  constructor() {
    this.users = new Map();
    this.emergencyCases = new Map();
    this.currentUserId = 1;
    this.currentEmergencyCaseId = 1;
    
    // Initialize with some mock emergency cases
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockCases: EmergencyCase[] = [
      {
        id: 1,
        type: "Cardiac Arrest",
        description: "Elderly man collapsed while jogging, not responding to verbal commands",
        location: "Central Park, Near Fountain",
        latitude: "24.4539",
        longitude: "54.3773",
        reporterName: "Ahmed Al Rashid",
        reporterPhone: "+971-50-123-4567",
        severity: "critical",
        status: "pending",
        createdAt: new Date("2024-01-19T13:45:00Z")
      },
      {
        id: 2,
        type: "Traffic Accident",
        description: "Two car collision, multiple passengers injured, need immediate medical attention",
        location: "Sheikh Zayed Road, Exit 45",
        latitude: "24.4395",
        longitude: "54.4068",
        reporterName: "Sara Mohamed",
        reporterPhone: "+971-52-987-6543",
        severity: "high",
        status: "pending",
        createdAt: new Date("2024-01-19T13:38:00Z")
      },
      {
        id: 3,
        type: "Severe Bleeding",
        description: "Construction worker with deep cut on arm from machinery accident",
        location: "Dubai Marina Construction Site",
        latitude: "24.4332",
        longitude: "54.4097",
        reporterName: "Omar Hassan",
        reporterPhone: "+971-55-456-7890",
        severity: "high",
        status: "pending",
        createdAt: new Date("2024-01-19T13:30:00Z")
      },
      {
        id: 4,
        type: "Allergic Reaction",
        description: "Child having severe allergic reaction to food, difficulty breathing",
        location: "Mall of the Emirates, Food Court",
        latitude: "24.4526",
        longitude: "54.3857",
        reporterName: "Fatima Al Zahra",
        reporterPhone: "+971-50-234-5678",
        severity: "critical",
        status: "dispatched",
        createdAt: new Date("2024-01-19T13:15:00Z")
      },
      {
        id: 5,
        type: "Burns",
        description: "Kitchen accident with hot oil, second degree burns on hands and arms",
        location: "Jumeirah Beach Residence, Tower 3",
        latitude: "24.4270",
        longitude: "54.4194",
        reporterName: "Khalid Al Mansouri",
        reporterPhone: "+971-56-345-6789",
        severity: "medium",
        status: "pending",
        createdAt: new Date("2024-01-19T13:00:00Z")
      }
    ];

    mockCases.forEach(case_ => {
      this.emergencyCases.set(case_.id, case_);
      this.currentEmergencyCaseId = Math.max(this.currentEmergencyCaseId, case_.id + 1);
    });
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

  async getAllEmergencyCases(): Promise<EmergencyCase[]> {
    return Array.from(this.emergencyCases.values());
  }

  async getEmergencyCase(id: number): Promise<EmergencyCase | undefined> {
    return this.emergencyCases.get(id);
  }

  async createEmergencyCase(insertEmergencyCase: InsertEmergencyCase): Promise<EmergencyCase> {
    const id = this.currentEmergencyCaseId++;
    const emergencyCase: EmergencyCase = {
      ...insertEmergencyCase,
      id,
      createdAt: new Date()
    };
    this.emergencyCases.set(id, emergencyCase);
    return emergencyCase;
  }

  async updateEmergencyCaseStatus(id: number, status: string): Promise<EmergencyCase | undefined> {
    const emergencyCase = this.emergencyCases.get(id);
    if (emergencyCase) {
      const updatedCase = { ...emergencyCase, status };
      this.emergencyCases.set(id, updatedCase);
      return updatedCase;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
