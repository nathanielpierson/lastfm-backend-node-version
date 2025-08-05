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

export const createAlbumService = async (albumData) => {
  const {
    title,
    artist_id,
    one_week,
    one_month,
    three_month,
    six_month,
    twelve_month,
    play_count_total,
    image_url,
  } = albumData;

  const query = `
    INSERT INTO albums 
    (title, artist_id, one_week, one_month, three_month, six_month, twelve_month, play_count_total, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (title, artist_id) DO UPDATE SET
      one_week = EXCLUDED.one_week,
      one_month = EXCLUDED.one_month,
      three_month = EXCLUDED.three_month,
      six_month = EXCLUDED.six_month,
      twelve_month = EXCLUDED.twelve_month,
      play_count_total = EXCLUDED.play_count_total,
      image_url = EXCLUDED.image_url,
      updated_at = NOW()
    RETURNING *
  `;

  const values = [
    title,
    artist_id,
    one_week,
    one_month,
    three_month,
    six_month,
    twelve_month,
    play_count_total,
    image_url,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error creating album: ${error.message}`);
  }
};

// Helper function to format album data with nested artist structure
const formatAlbumWithNestedArtist = (row) => {
  return {
    id: row.id,
    title: row.title,
    one_week: row.one_week,
    one_month: row.one_month,
    three_month: row.three_month,
    six_month: row.six_month,
    twelve_month: row.twelve_month,
    play_count_total: row.play_count_total,
    image_url: row.image_url,
    ignored: row.ignored,
    created_at: row.created_at,
    updated_at: row.updated_at,
    artist: {
      id: row.artist_id,
      name: row.artist_name,
    },
  };
};

export const getAllAlbumsWithArtistsService = async () => {
  const query = `
    SELECT 
      a.id,
      a.title,
      a.one_week,
      a.one_month,
      a.three_month,
      a.six_month,
      a.twelve_month,
      a.play_count_total,
      a.image_url,
      a.ignored,
      a.created_at,
      a.updated_at,
      ar.id as artist_id,
      ar.name as artist_name
    FROM albums a
    JOIN artists ar ON a.artist_id = ar.id
    WHERE a.ignored = FALSE
    ORDER BY a.created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows.map(formatAlbumWithNestedArtist);
  } catch (error) {
    throw new Error(`Error fetching albums: ${error.message}`);
  }
};

export const getAlbumsByArtistService = async (artistId) => {
  const query = `
    SELECT 
      a.id,
      a.title,
      a.one_week,
      a.one_month,
      a.three_month,
      a.six_month,
      a.twelve_month,
      a.play_count_total,
      a.image_url,
      a.ignored,
      a.created_at,
      a.updated_at,
      ar.id as artist_id,
      ar.name as artist_name
    FROM albums a
    JOIN artists ar ON a.artist_id = ar.id
    WHERE a.artist_id = $1 AND a.ignored = FALSE
    ORDER BY a.play_count_total DESC
  `;

  try {
    const result = await pool.query(query, [artistId]);
    return result.rows.map(formatAlbumWithNestedArtist);
  } catch (error) {
    throw new Error(`Error fetching albums by artist: ${error.message}`);
  }
};

export const updateAlbumIgnoredStatusService = async (albumId, ignored) => {
  const query = `
    UPDATE albums 
    SET ignored = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [albumId, ignored]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error updating album ignored status: ${error.message}`);
  }
};

export const getAllAlbumsWithArtistsIncludingIgnoredService = async () => {
  const query = `
    SELECT 
      a.id,
      a.title,
      a.one_week,
      a.one_month,
      a.three_month,
      a.six_month,
      a.twelve_month,
      a.play_count_total,
      a.image_url,
      a.ignored,
      a.created_at,
      a.updated_at,
      ar.id as artist_id,
      ar.name as artist_name
    FROM albums a
    JOIN artists ar ON a.artist_id = ar.id
    ORDER BY a.created_at DESC
  `;

  try {
    const result = await pool.query(query);
    return result.rows.map(formatAlbumWithNestedArtist);
  } catch (error) {
    throw new Error(`Error fetching all albums: ${error.message}`);
  }
};
