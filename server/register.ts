import { db } from "./storage";
import { users } from "../shared/schema";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email a heslo jsou povinné." });
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return res.status(400).json({ message: "Uživatel s tímto emailem už existuje." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role: "admin",
    } as any)
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