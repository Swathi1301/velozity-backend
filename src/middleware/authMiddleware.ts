import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(req: any, res: Response, next: NextFunction) {
  // For debugging headers
  console.log("HEADERS:", req.headers);

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token found" });

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}