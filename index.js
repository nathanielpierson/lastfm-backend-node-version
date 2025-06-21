import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

// Import route modules
import artistRoutes from "./routes/artistRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route bindings
app.use("/api/artist", artistRoutes);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("🎵 Last.fm Proxy API is running!");
});

app.get("/top-tracks", async (req, res) => { 
  const artist = req.query.artist;

  if (!artist) {
    return res.status(400).json({ error: 'Artist is required' });
  }

  try {
    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'artist.gettoptracks',
        artist,
        api_key: process.env.LASTFM_API_KEY,
        format: 'json'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Last.fm' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
