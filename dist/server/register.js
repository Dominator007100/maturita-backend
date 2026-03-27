"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const storage_1 = require("./storage");
const schema_1 = require("../shared/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email a heslo jsou povinné." });
    }
    const existing = await storage_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).limit(1);
    if (existing.length > 0) {
        return res.status(400).json({ message: "Uživatel s tímto emailem už existuje." });
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const [newUser] = await storage_1.db
        .insert(schema_1.users)
        .values({
        email,
        passwordHash,
        role: "admin",
    })
        .returning();
    return res.json({
        message: "Registrace úspěšná",
        user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        },
    });
}
