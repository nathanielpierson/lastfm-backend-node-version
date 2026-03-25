import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Run each statement separately. Some pg/Postgres setups do not apply a full
 * multi-statement script reliably in one pool.query() call.
 */
const MIGRATION_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)`,
  `CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name)`,
  `CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  one_week INTEGER DEFAULT 0,
  one_month INTEGER DEFAULT 0,
  three_month INTEGER DEFAULT 0,
  six_month INTEGER DEFAULT 0,
  twelve_month INTEGER DEFAULT 0,
  play_count_total INTEGER DEFAULT 0,
  image_url TEXT,
  ignored BOOLEAN DEFAULT FALSE,
  lastfm_username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(title, artist_id, lastfm_username)
)`,
  `CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id)`,
  `CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title)`,
  `CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_albums_ignored ON albums(ignored)`,
  `DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'albums' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE albums ADD COLUMN image_url TEXT;
    END IF;
END $$`,
  `DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'albums' AND column_name = 'ignored'
    ) THEN
        ALTER TABLE albums ADD COLUMN ignored BOOLEAN DEFAULT FALSE;
    END IF;
END $$`,
  `DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'albums' AND column_name = 'lastfm_username'
    ) THEN
        ALTER TABLE albums ADD COLUMN lastfm_username VARCHAR(255);
        UPDATE albums SET lastfm_username = 'frogdunker' WHERE lastfm_username IS NULL;
    END IF;
END $$`,
  `DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'albums_title_artist_id_key' AND conrelid = 'albums'::regclass
    ) THEN
        ALTER TABLE albums DROP CONSTRAINT albums_title_artist_id_key;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'albums_title_artist_id_lastfm_username_key' AND conrelid = 'albums'::regclass
    ) THEN
        ALTER TABLE albums ADD CONSTRAINT albums_title_artist_id_lastfm_username_key
          UNIQUE (title, artist_id, lastfm_username);
    END IF;
END $$`,
];

export async function runMigrationStatements(pool) {
  for (let i = 0; i < MIGRATION_STATEMENTS.length; i++) {
    await pool.query(MIGRATION_STATEMENTS[i]);
  }
}

/**
 * If the database has no `albums` table, run the migration.
 */
export async function ensureSchemaIfNeeded(pool) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'albums'
    ) AS exists;
  `);
  if (result.rows[0]?.exists) {
    return;
  }
  console.log("Database has no albums table; applying migration (sequential statements) …");
  await runMigrationStatements(pool);
  console.log("Migration applied: artists and albums are ready.");
}

/** Full migration for /api/setup-db (idempotent). */
export async function runMigration(pool) {
  await runMigrationStatements(pool);
}
