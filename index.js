import express from "express";
import dotenv from "dotenv";
import corsMiddleware from "./config/cors.js";
import axios from "axios";

// Import route modules
import artistRoutes from "./routes/artistRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Route bindings
app.use("/", artistRoutes);
app.use("/api/users", userRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🎵 Last.fm Proxy API is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
