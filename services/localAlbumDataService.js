import { Pool } from "pg";

// Configure database connection
let pool;

if (process.env.DATABASE_URL) {
  // Use connection string if provided
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  // Use individual parameters
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "lastfm_api_project_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  });
}

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
