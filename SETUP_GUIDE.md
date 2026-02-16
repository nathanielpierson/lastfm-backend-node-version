# Setup Guide: Getting Data into Your Database

## Overview

This backend app fetches data from the Last.fm API and stores it in a PostgreSQL database. Here's how to get it working:

## Step 1: Database Setup

### 1.1 Create the Database (if not already created)
```bash
createdb lastfm_api_project_db
```

### 1.2 Run the Database Migration
This creates the `artists` and `albums` tables:
```bash
npm run setup-db
```

You should see:
```
🔧 Setting up database...
✅ Database migration completed successfully!
📊 Tables "artists" and "albums" are ready.
```

## Step 2: Environment Variables

Make sure your `.env` file has:

```env
LASTFM_API_KEY=your_actual_api_key_here
LASTFM_SHARED_SECRET=your_shared_secret_here  # Only needed for some endpoints

# Database connection (choose one method):

# Method 1: Full connection string
DATABASE_URL=postgresql://postgres:password@localhost:5432/lastfm_api_project_db

# OR Method 2: Individual values
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lastfm_api_project_db
DB_USER=postgres
DB_PASSWORD=your_password_here

PORT=3000
```

## Step 3: How Data Flow Works

### Fetching and Storing Data

**To fetch data from Last.fm API and store it in your database:**

```bash
POST http://localhost:3000/api/users/localalbumdata
Content-Type: application/json

{
  "username": "your_lastfm_username"
}
```

This endpoint:
1. Fetches album data from Last.fm API for multiple time periods (1 week, 1 month, 3 months, 6 months, 12 months, overall)
2. Creates/updates artists in the `artists` table
3. Creates/updates albums in the `albums` table with play counts for each period
4. Returns the saved data

### Retrieving Stored Data

Once data is stored, you can retrieve it with these GET endpoints:

**Get all albums (excluding ignored ones):**
```bash
GET http://localhost:3000/api/users/localalbumdata
```

**Get all artists:**
```bash
GET http://localhost:3000/api/users/artists
```

**Get albums for a specific artist:**
```bash
GET http://localhost:3000/api/users/artists/:artistId/albums
```

## Step 4: Available API Endpoints

### Endpoints that STORE data in database:
- `POST /api/users/localalbumdata` - Fetches from Last.fm and stores in DB

### Endpoints that READ from database:
- `GET /api/users/localalbumdata` - Get all stored albums
- `GET /api/users/localalbumdata/raw` - Get all stored albums (raw format)
- `GET /api/users/artists` - Get all artists
- `GET /api/users/artists/:artistId/albums` - Get albums for an artist

### Endpoints that query Last.fm API directly (don't store):
- `GET /top-tracks?artist=ArtistName` - Get top tracks for an artist
- `GET /api/users/usertopalbums?user=username&period=7day` - Get user top albums (use `period=7day` for weekly)

## Step 5: Testing the Setup

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test the root endpoint:**
   ```bash
   curl http://localhost:3000/
   ```
   Should return: `🎵 Last.fm Proxy API is running!`

3. **Fetch and store data:**
   ```bash
   curl -X POST http://localhost:3000/api/users/localalbumdata \
     -H "Content-Type: application/json" \
     -d '{"username": "your_lastfm_username"}'
   ```

4. **Retrieve stored data:**
   ```bash
   curl http://localhost:3000/api/users/localalbumdata
   ```

## Troubleshooting

### "could not GET routerlink" Error
This usually means:
- Wrong URL path (check the routes above)
- Server not running
- Database connection issue

### Database Connection Errors
- Verify PostgreSQL is running: `pg_isready`
- Check your `.env` file has correct database credentials
- Test connection: `psql -U postgres -d lastfm_api_project_db`

### Empty Results
- Make sure you've run `POST /api/users/localalbumdata` first to populate the database
- Check that your Last.fm username is correct
- Verify your `LASTFM_API_KEY` is valid

## Quick Start Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `lastfm_api_project_db` exists
- [ ] Ran `npm run setup-db` successfully
- [ ] `.env` file has `LASTFM_API_KEY` and database credentials
- [ ] Server starts without errors: `npm run dev`
- [ ] POST to `/api/users/localalbumdata` with your Last.fm username
- [ ] GET from `/api/users/localalbumdata` returns your stored albums
