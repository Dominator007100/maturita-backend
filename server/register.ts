import { db } from "../shared/db";
import { users } from "../shared/schema";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email a heslo jsou povinné." });
  }

  // Zkontrolujeme, jestli už existuje
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return res.status(400).json({ message: "Uživatel s tímto emailem už existuje." });
  }

  // Zahashujeme heslo
  const passwordHash = await bcrypt.hash(password, 10);

  // Vytvoříme uživatele
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role: "admin", // nebo "user"
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
