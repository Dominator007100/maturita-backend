"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../shared/db");
const schema_1 = require("../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (result.length === 0) {
            return res.status(400).json({ message: "Nesprávný email nebo heslo." });
        }
        const user = result[0];
        const valid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(400).json({ message: "Nesprávný email nebo heslo." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({ token });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Chyba serveru." });
    }
}
// REGISTER
async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email a heslo jsou povinné." });
    }
    try {
        const existing = await db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existing.length > 0) {
            return res.status(400).json({ message: "Účet s tímto emailem již existuje." });
        }
        const hash = await bcrypt_1.default.hash(password, 10);
        await db_1.db.insert(schema_1.users).values({
            email,
            passwordHash: hash,
        });
        return res.json({ message: "Registrace proběhla úspěšně." });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Chyba serveru." });
    }
}
