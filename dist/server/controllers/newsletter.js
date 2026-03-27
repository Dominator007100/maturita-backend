"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = subscribe;
exports.unsubscribe = unsubscribe;
exports.listSubscribers = listSubscribers;
const db_1 = require("../../shared/db");
const schema_1 = require("../../shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function subscribe(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const existing = await db_1.db
        .select()
        .from(schema_1.emailSubscriptions)
        .where((0, drizzle_orm_1.eq)(schema_1.emailSubscriptions.email, email));
    if (existing.length > 0) {
        return res.json({ message: "Already subscribed" });
    }
    await db_1.db.insert(schema_1.emailSubscriptions).values({ email });
    return res.json({ message: "Subscribed successfully" });
}
async function unsubscribe(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    await db_1.db
        .update(schema_1.emailSubscriptions)
        .set({ unsubscribedAt: new Date() })
        .where((0, drizzle_orm_1.eq)(schema_1.emailSubscriptions.email, email));
    return res.json({ message: "Unsubscribed successfully" });
}
async function listSubscribers(req, res) {
    const subscribers = await db_1.db
        .select()
        .from(schema_1.emailSubscriptions)
        .where((0, drizzle_orm_1.eq)(schema_1.emailSubscriptions.unsubscribedAt, null));
    return res.json(subscribers);
}
