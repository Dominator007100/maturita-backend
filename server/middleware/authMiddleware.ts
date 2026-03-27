import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Přístup zamítnut – chybí token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    // @ts-ignore
    req.user = decoded; // uložíme info o uživateli do requestu
    next();
  } catch (err) {
    return res.status(401).json({ message: "Neplatný nebo expirovaný token." });
  }
}
