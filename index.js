import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import corsMiddleware from "./config/cors.js";
import { pool } from "./config/database.js";

// Import route modules
import artistRoutes from "./routes/artistRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Route bindings
app.use("/", artistRoutes);
app.use("/api/users", userRoutes);

// One-time DB setup (run migration). Call from browser when you have no shell.
// Requires ?secret=YOUR_SETUP_SECRET (set SETUP_SECRET in Render env).
app.get("/api/setup-db", async (req, res) => {
  const secret = process.env.SETUP_SECRET;
  if (!secret || req.query.secret !== secret) {
    return res.status(401).json({ error: "Missing or invalid secret" });
  }
  try {
    const sqlPath = path.join(__dirname, "database", "migration.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");
    await pool.query(sqlContent);
    res.json({
      ok: true,
      message: "Database migration completed. Tables artists and albums are ready.",
    });
  } catch (err) {
    console.error("Setup DB error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🎵 Last.fm Proxy API is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
