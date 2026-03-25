import { Request, Response, NextFunction } from "express";
import redis from "../utils/redis";

export default async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.ip;
  const key = `rate:${ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 1 minute
  }

  if (count > 10) {
    return res.status(429).json({
      error: "Too many requests"
    });
  }

  next();
}