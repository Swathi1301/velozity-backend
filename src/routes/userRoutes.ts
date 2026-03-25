import { Router } from "express";

export default function userRoutes() {
  const router = Router();

  router.get("/", (req, res) => {
    // Dummy users for testing
    const users = [
      { id: 1, name: "Alice", email: "alice@test.com", role: "OWNER" },
      { id: 2, name: "Bob", email: "bob@test.com", role: "USER" },
    ];

    console.log("HEADERS:", req.headers); // confirm headers in console
    res.json(users);
  });

  return router;
}