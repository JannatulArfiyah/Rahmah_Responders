import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmergencyCaseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Emergency cases routes
  app.get("/api/emergency-cases", async (req, res) => {
    try {
      const cases = await storage.getAllEmergencyCases();
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency cases" });
    }
  });

  app.get("/api/emergency-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const emergencyCase = await storage.getEmergencyCase(id);
      
      if (!emergencyCase) {
        return res.status(404).json({ message: "Emergency case not found" });
      }
      
      res.json(emergencyCase);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency case" });
    }
  });

  app.post("/api/emergency-cases", async (req, res) => {
    try {
      const validatedData = insertEmergencyCaseSchema.parse(req.body);
      const emergencyCase = await storage.createEmergencyCase(validatedData);
      res.status(201).json(emergencyCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create emergency case" });
    }
  });

  app.patch("/api/emergency-cases/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedCase = await storage.updateEmergencyCaseStatus(id, status);
      
      if (!updatedCase) {
        return res.status(404).json({ message: "Emergency case not found" });
      }
      
      res.json(updatedCase);
    } catch (error) {
      res.status(500).json({ message: "Failed to update emergency case status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
