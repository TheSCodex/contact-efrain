import { Request, Response, NextFunction } from "express";

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.header("x-api-key");
  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}