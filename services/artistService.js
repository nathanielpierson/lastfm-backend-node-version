import { pool } from "../config/database.js";

export const createArtistService = async (artistName) => {
  const query = `
    INSERT INTO artists (name)
    VALUES ($1)
    ON CONFLICT (name) DO UPDATE SET updated_at = NOW()
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [artistName]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating artist: ${error.message}`);
  }
};

export const findArtistByNameService = async (artistName) => {
  const query = "SELECT * FROM artists WHERE name = $1";

  try {
    const result = await pool.query(query, [artistName]);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Error finding artist: ${error.message}`);
  }
};

export const getAllArtistsService = async () => {
  const query = "SELECT * FROM artists ORDER BY name";

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching artists: ${error.message}`);
  }
};
