import type { Express } from "express";
import { type Server } from "http";
import { authMiddleware } from "./middleware/authMiddleware";
import { storage } from "./storage";
import {
  insertQuizSubmissionSchema,
  type InsertQuizSubmission,
  type QuizSubmission,
  type NewsArticle,
  type InsertNewsArticle
} from "../shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Odeslání testu
  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const parsed = insertQuizSubmissionSchema.parse(req.body);
      const submission = await storage.createQuizSubmission(parsed);
      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid submission data" });
    }
  });

  // Získání jedné submission
  app.get("/api/quiz/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getQuizSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.json(submission);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch submission" });
    }
  });

  // Získání všech submissions
  app.get("/api/quiz/submissions", async (_req, res) => {
    try {
      const submissions = await storage.getQuizSubmissions();
      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch submissions" });
    }
  });

  // Získání news
  app.get("/api/news", async (_req, res) => {
    try {
      const articles = await storage.getNewsArticles();
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to fetch news" });
    }
  });

  // 🔥 CHRÁNĚNÝ ENDPOINT PRO TEST
  app.get("/api/quiz/start", authMiddleware, (req, res) => {
    res.json({ message: "Můžeš začít test" });
  });

  return httpServer;
}
