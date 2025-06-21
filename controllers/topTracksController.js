import axios from "axios";

export async function getTopTracks(req, res) {
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
    }
    );
    const tracks = response.data.toptracks;
    console.log(tracks.track.length);
    var i = 0;
    while (i < tracks.track.length) {
      console.log(tracks.track[i].name);
      console.log(i);
      i++;
    }
    // console.log(tracks.track[0]);
    // console.log(tracks.track.length);
    // const trackNames = tracks.map(tracks => tracks.name);
    // console.log(trackNames);
    
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from Last.fm' });
  }
}