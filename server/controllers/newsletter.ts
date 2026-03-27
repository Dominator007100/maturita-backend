import { db } from "../../shared/db";
import { emailSubscriptions } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export async function subscribe(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const existing = await db
    .select()
    .from(emailSubscriptions)
    .where(eq(emailSubscriptions.email, email));

  if (existing.length > 0) {
    return res.json({ message: "Already subscribed" });
  }

  await db.insert(emailSubscriptions).values({ email } as any);

  return res.json({ message: "Subscribed successfully" });
}

export async function unsubscribe(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  await db
    .update(emailSubscriptions)
    .set({ unsubscribedAt: new Date() } as any)
    .where(eq(emailSubscriptions.email, email));

  return res.json({ message: "Unsubscribed successfully" });
}

export async function listSubscribers(req: Request, res: Response) {
  const subscribers = await db
    .select()
    .from(emailSubscriptions)
    .where(eq(emailSubscriptions.unsubscribedAt, null as any));

  return res.json(subscribers);
}