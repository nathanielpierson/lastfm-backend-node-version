-- Migration script to add ignored column to existing albums table
-- This script is safe to run multiple times

-- Add ignored column to albums table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'albums' AND column_name = 'ignored'
    ) THEN
        ALTER TABLE albums ADD COLUMN ignored BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added ignored column to albums table';
    ELSE
        RAISE NOTICE 'ignored column already exists in albums table';
    END IF;
END $$;

-- Create index on ignored column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_albums_ignored ON albums(ignored);

-- Ensure the artists table exists
CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for artists if they don't exist
CREATE INDEX IF NOT EXISTS idx_artists_name ON artists(name);

-- Ensure the albums table exists with all required columns
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
  one_week INTEGER DEFAULT 0,
  one_month INTEGER DEFAULT 0,
  three_month INTEGER DEFAULT 0,
  six_month INTEGER DEFAULT 0,
  twelve_month INTEGER DEFAULT 0,
  play_count_total INTEGER DEFAULT 0,
  ignored BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(title, artist_id)
);

-- Create indexes for albums if they don't exist
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_title ON albums(title);
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums(created_at);
CREATE INDEX IF NOT EXISTS idx_albums_ignored ON albums(ignored); 