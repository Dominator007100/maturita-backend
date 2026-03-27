import { db } from "../../shared/db.ts";
import { emailSubscriptions } from "../../shared/schema.ts";
import { eq } from "drizzle-orm";

export async function subscribe(req, res) {
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

  await db.insert(emailSubscriptions).values({
    email,
    confirmed: true,
  });

  return res.json({ message: "Subscribed successfully" });
}

export async function unsubscribe(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  await db
    .update(emailSubscriptions)
    .set({ unsubscribedAt: new Date() })
    .where(eq(emailSubscriptions.email, email));

  return res.json({ message: "Unsubscribed successfully" });
}

export async function listSubscribers(req, res) {
  const subscribers = await db
    .select()
    .from(emailSubscriptions)
    .where(eq(emailSubscriptions.unsubscribedAt, null));

  return res.json(subscribers);
}
