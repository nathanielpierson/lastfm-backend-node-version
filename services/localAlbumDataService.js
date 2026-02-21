import { pool } from "../config/database.js";

export const createLocalAlbumDataService = async (albumData) => {
  const {
    title,
    artist_name,
    one_week,
    one_month,
    three_month,
    six_month,
    twelve_month,
    play_count_total,
  } = albumData;

  const query = `
    INSERT INTO local_album_data 
    (title, artist_name, one_week, one_month, three_month, six_month, twelve_month, play_count_total, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING *
  `;

  const values = [
    title,
    artist_name,
    one_week,
    one_month,
    three_month,
    six_month,
    twelve_month,
    play_count_total,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating local album data: ${error.message}`);
  }
};

export const getLocalAlbumDataService = async () => {
  const query = "SELECT * FROM local_album_data ORDER BY created_at DESC";

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching local album data: ${error.message}`);
  }
};
