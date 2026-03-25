import express from "express";

const app = express();
app.use(express.json());

// ✅ Dummy GET /users
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice", email: "alice@test.com", role: "OWNER" },
    { id: 2, name: "Bob", email: "bob@test.com", role: "USER" }
  ]);
});

// ✅ Dummy POST /users
app.post("/users", (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: "All fields required" });
  }
  res.json({ id: 3, name, email, role });
});

// ✅ Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server working" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000 ✅");
});