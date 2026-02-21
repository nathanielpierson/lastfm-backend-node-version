-- Migration script: safe to run multiple times.
-- Order: create tables first, then add columns for existing DBs, then indexes.

-- 1. Create artists table first (albums references it)
CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

-- 2. Create albums table with all columns
CREATE TABLE IF NOT EXISTS albums (
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
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(title, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title);
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums(created_at);
CREATE INDEX IF NOT EXISTS idx_albums_ignored ON albums(ignored);

-- 3. Add columns to existing albums tables that were created before these columns existed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'albums' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE albums ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to albums table';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'albums' AND column_name = 'ignored'
    ) THEN
        ALTER TABLE albums ADD COLUMN ignored BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added ignored column to albums table';
    END IF;
END $$;
