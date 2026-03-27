"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = exports.db = void 0;
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../shared/schema");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
exports.db = (0, node_postgres_1.drizzle)(pool);
class DatabaseStorage {
    async getUser(id) {
        const [user] = await exports.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return user;
    }
    async getUserByEmail(email) {
        const [user] = await exports.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        return user;
    }
    async createUser(insertUser) {
        const [user] = await exports.db
            .insert(schema_1.users)
            .values({
            email: insertUser.email,
            passwordHash: insertUser.passwordHash,
            role: insertUser.role ?? "admin",
        })
            .returning();
        return user;
    }
    async createQuizSubmission(submission) {
        const [result] = await exports.db.insert(schema_1.quizSubmissions).values(submission).returning();
        return result;
    }
    async getQuizSubmission(id) {
        const [result] = await exports.db.select().from(schema_1.quizSubmissions).where((0, drizzle_orm_1.eq)(schema_1.quizSubmissions.id, id));
        return result;
    }
    async getQuizSubmissions() {
        return exports.db.select().from(schema_1.quizSubmissions).orderBy((0, drizzle_orm_1.desc)(schema_1.quizSubmissions.submittedAt));
    }
    async getNewsArticles() {
        return exports.db.select().from(schema_1.newsArticles).orderBy((0, drizzle_orm_1.desc)(schema_1.newsArticles.publishedAt));
    }
    async getNewsArticleByUrl(url) {
        const [article] = await exports.db.select().from(schema_1.newsArticles).where((0, drizzle_orm_1.eq)(schema_1.newsArticles.sourceUrl, url));
        return article;
    }
    async createNewsArticle(article) {
        const [result] = await exports.db.insert(schema_1.newsArticles).values(article).returning();
        return result;
    }
    async getNewsArticleCount() {
        const result = await exports.db.select().from(schema_1.newsArticles);
        return result.length;
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
