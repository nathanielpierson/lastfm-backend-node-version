import { Pool } from "pg";

// Configure database connection
let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "lastfm_api_project_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  });
}

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
