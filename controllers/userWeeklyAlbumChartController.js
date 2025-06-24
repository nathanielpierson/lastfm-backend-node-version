import axios from "axios";

const getWeeklyAlbumChart = async (req, res) => {
  const { user, from, to } = req.query;

  if (!user) {
    return res.status(400).json({ error: 'User parameter is required' });
  }

  try {
    const params = {
      method: 'user.getWeeklyAlbumChart',
      user,
      api_key: process.env.LASTFM_API_KEY,
      format: 'json',
    };

    if (from) params.from = from;
    if (to) params.to = to;

    const response = await axios.get('http://ws.audioscrobbler.com/2.0/', { params });

    const albums = response.data.weeklyalbumchart.album;

    res.json(albums);
  } catch (error) {
    console.error('Error fetching weekly album chart:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Last.fm' });
  }
};

module.exports = { getWeeklyAlbumChart };
