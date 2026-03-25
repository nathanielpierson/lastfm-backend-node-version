import { Pool } from "pg";

/**
 * Shared database pool. When DATABASE_URL is set (e.g. on Render), use SSL
 * so connection to Render Postgres succeeds.
 */
function createPool() {
  if (process.env.DATABASE_URL) {
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      // Render Postgres requires SSL
      ssl: { rejectUnauthorized: false },
    });
  }
  return new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "lastfm_api_project_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  });
}

export const pool = createPool();
