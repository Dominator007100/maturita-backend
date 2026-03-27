import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../../shared/db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (result.length === 0) {
      return res.status(400).json({ message: "Nesprávný email nebo heslo." });
    }

    const user = result[0];

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(400).json({ message: "Nesprávný email nebo heslo." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({ token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Chyba serveru." });
  }
}

// REGISTER
export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email a heslo jsou povinné." });
  }

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return res.status(400).json({ message: "Účet s tímto emailem již existuje." });
    }

    const hash = await bcrypt.hash(password, 10);

await db.insert(users).values({
  email,
  passwordHash: hash,
});



    return res.json({ message: "Registrace proběhla úspěšně." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Chyba serveru." });
  }
}
