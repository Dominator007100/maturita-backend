"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const auth_1 = require("./middleware/auth");
const storage_1 = require("./storage");
const schema_1 = require("../shared/schema");
async function registerRoutes(httpServer, app) {
    app.post("/api/quiz/submit", async (req, res) => {
        try {
            const parsed = schema_1.insertQuizSubmissionSchema.parse(req.body);
            const submission = await storage_1.storage.createQuizSubmission(parsed);
            res.json(submission);
        }
        catch (error) {
            res.status(400).json({ message: error.message || "Invalid submission data" });
        }
    });
    app.get("/api/quiz/submissions/:id", async (req, res) => {
        try {
            const submission = await storage_1.storage.getQuizSubmission(req.params.id);
            if (!submission) {
                return res.status(404).json({ message: "Submission not found" });
            }
            res.json(submission);
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Failed to fetch submission" });
        }
    });
    app.get("/api/quiz/submissions", async (_req, res) => {
        try {
            const submissions = await storage_1.storage.getQuizSubmissions();
            res.json(submissions);
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Failed to fetch submissions" });
        }
    });
    app.get("/api/news", async (_req, res) => {
        try {
            const articles = await storage_1.storage.getNewsArticles();
            res.json(articles);
        }
        catch (error) {
            res.status(500).json({ message: error.message || "Failed to fetch news" });
        }
    });
    app.get("/api/quiz/start", auth_1.authMiddleware, (req, res) => {
        res.json({ message: "Můžeš začít test" });
    });
    return httpServer;
}
