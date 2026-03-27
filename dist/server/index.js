"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = log;
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const static_1 = require("./static");
const http_1 = require("http");
const newsCron_1 = require("./newsCron");
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const newsletter_2 = require("./controllers/newsletter");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/api", auth_1.default);
const httpServer = (0, http_1.createServer)(app);
app.use(express_1.default.json({ verify: (req, _res, buf) => { req.rawBody = buf; } }));
app.use(express_1.default.urlencoded({ extended: false }));
function log(message, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
    });
    console.log(`${formattedTime} [${source}] ${message}`);
}
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse)
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            log(logLine);
        }
    });
    next();
});
app.post("/api/subscribe", newsletter_2.subscribe);
app.post("/api/unsubscribe", newsletter_2.unsubscribe);
app.use("/api/newsletter", newsletter_1.default);
(async () => {
    const { seedDatabase } = await Promise.resolve().then(() => __importStar(require("./seed")));
    await seedDatabase();
    await (0, routes_1.registerRoutes)(httpServer, app);
    app.use((err, _req, res, next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("Internal Server Error:", err);
        if (res.headersSent)
            return next(err);
        return res.status(status).json({ message });
    });
    (0, static_1.serveStatic)(app);
    (0, newsCron_1.startNewsCron)();
    const port = parseInt(process.env.PORT || "3000", 10);
    httpServer.listen({ port, host: "0.0.0.0" }, () => { log(`serving on port ${port}`); });
})();
