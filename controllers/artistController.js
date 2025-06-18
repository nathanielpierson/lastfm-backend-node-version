// controllers/artistController.js

export async function getArtistInfo(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Missing artist name" });
  }

  try {
    // TODO: Call Last.fm API to get artist info using name
    const artistData = {
      name: "Placeholder Artist",
      bio: "This is where the artist bio will go.",
      topTracks: [], // Optional: fill in later
    };

    res.json(artistData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artist info" });
  }
}
