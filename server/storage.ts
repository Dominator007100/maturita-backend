import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, desc } from "drizzle-orm";
import {
  users, quizSubmissions, newsArticles,
  type User, type InsertUser,
  type QuizSubmission, type InsertQuizSubmission,
  type NewsArticle, type InsertNewsArticle,
} from "../shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission>;
  getQuizSubmission(id: string): Promise<QuizSubmission | undefined>;
  getQuizSubmissions(): Promise<QuizSubmission[]>;
  getNewsArticles(): Promise<NewsArticle[]>;
  getNewsArticleByUrl(url: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getNewsArticleCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

async createUser(insertUser: InsertUser): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      email: insertUser.email,
      passwordHash: insertUser.passwordHash,
      role: insertUser.role ?? "admin",
    })
    .returning();
  return user;
}


  async createQuizSubmission(submission: InsertQuizSubmission): Promise<QuizSubmission> {
    const [result] = await db.insert(quizSubmissions).values(submission).returning();
    return result;
  }

  async getQuizSubmission(id: string): Promise<QuizSubmission | undefined> {
    const [result] = await db
      .select()
      .from(quizSubmissions)
      .where(eq(quizSubmissions.id, id));
    return result;
  }

  async getQuizSubmissions(): Promise<QuizSubmission[]> {
    return db
      .select()
      .from(quizSubmissions)
      .orderBy(desc(quizSubmissions.submittedAt));
  }

  async getNewsArticles(): Promise<NewsArticle[]> {
    return db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt));
  }

  async getNewsArticleByUrl(url: string): Promise<NewsArticle | undefined> {
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.sourceUrl, url));
    return article;
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [result] = await db.insert(newsArticles).values(article).returning();
    return result;
  }

  async getNewsArticleCount(): Promise<number> {
    const result = await db.select().from(newsArticles);
    return result.length;
  }
}

export const storage = new DatabaseStorage();
