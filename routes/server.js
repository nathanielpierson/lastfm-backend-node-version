// const express = require('express');
// const axios = require('axios');
// const pool = require('./db');
// const app = express();
// const PORT = 3000;

// app.use(express.json());

// // Fetch from Last.fm, transform, save to DB
// app.get('/api/save-albums', async (req, res) => {
//   try {
//     const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
//       params: {
//         method: 'user.gettopalbums',
//         user: 'Frogdunker',
//         api_key: 'YOUR_API_KEY',
//         format: 'json',
//       },
//     });

//     const albums = response.data.topalbums.album;

//     const client = await pool.connect();

//     for (const album of albums) {
//       const title = album.title;
//       const artist_name = album.artist['#text'];
//       const play_count = parseInt(album.playcount);

//       await client.query(
//         `INSERT INTO albums (title, artist_name, play_count) VALUES ($1, $2, $3)`,
//         [title, artist_name, play_count]
//       );
//     }

//     client.release();
//     res.json({ message: 'Albums saved to PostgreSQL!' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Something went wrong saving albums.' });
//   }
// });

// // Serve albums to frontend
// app.get('/api/albums', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM albums ORDER BY created_at DESC');
//     res.json(rows);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: 'Error fetching albums.' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
