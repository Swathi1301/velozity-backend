// src/middleware/tenantAuth.ts
import { PrismaClient } from "@prisma/client";
import { Response, NextFunction } from "express";

export default function tenantAuth(prisma: PrismaClient) {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      console.log("REQ HEADERS RAW:", req.headers);

      // Read headers in a safe way
      const apiKey =
        req.headers["x-api-key"] ||
        req.headers["X-API-KEY"] ||
        req.headers["X-Api-Key"];

      if (!apiKey) {
        console.log("API KEY not found in headers!");
        return res.status(401).json({
          error: { code: "NO_API_KEY", message: "API key missing" },
        });
      }

      const key = await prisma.apiKey.findFirst({
        where: { keyHash: apiKey as string },
        include: { tenant: true },
      });

      if (!key) {
        return res.status(401).json({
          error: { code: "INVALID_KEY", message: "Invalid API key" },
        });
      }

      req.tenant = key.tenant;
      req.apiKey = key;

      next();
    } catch (err) {
      console.error("TENANT AUTH ERROR:", err);
      return res.status(500).json({
        error: { code: "AUTH_ERROR", message: "Authentication failed" },
      });
    }
  };
}