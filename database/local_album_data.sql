-- Create local_album_data table
CREATE TABLE IF NOT EXISTS local_album_data (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_name VARCHAR(255) NOT NULL,
  one_week INTEGER DEFAULT 0,
  one_month INTEGER DEFAULT 0,
  three_month INTEGER DEFAULT 0,
  six_month INTEGER DEFAULT 0,
  twelve_month INTEGER DEFAULT 0,
  play_count_total INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_local_album_data_artist ON local_album_data(artist_name);
CREATE INDEX IF NOT EXISTS idx_local_album_data_title ON local_album_data(title);
CREATE INDEX IF NOT EXISTS idx_local_album_data_created_at ON local_album_data(created_at); 