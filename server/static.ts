import express, { type Express } from "express";
import path from "path";

export function serveStatic(app: Express) {
  const publicPath = path.resolve(process.cwd(), "public");
  app.use(express.static(publicPath));
}
  