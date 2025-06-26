import axios from "axios";

export async function getTopAlbums(req, res) {
  const { user } = req.query;
  const { period } = req.query;

  if (!user) {
    return res.status(400).json({ error: 'User parameter is required' });
  }

  try {
    const params = {
      method: 'user.getTopAlbums',
      user,
      period,
      api_key: process.env.LASTFM_API_KEY,
      format: 'json',
    };

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', { params });

    const albums = response.data.topalbums.album;
    console.log(albums[0].playcount);
    res.json(albums);
  } catch (error) {
    console.error('Error fetching weekly album chart:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Last.fm' });
  }
}