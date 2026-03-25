import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default function authRoutes(prisma: PrismaClient) {
  const router = Router();

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) return res.status(401).json({ error: "User not found" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign(
        { userId: user.id, role: user.role, tenantId: user.tenantId },
        "SECRET_KEY",
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  return router;
}