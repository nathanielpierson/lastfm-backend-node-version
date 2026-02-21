# API Endpoints Reference

## Base URL
- Local: `http://localhost:3000`
- Production: Your Render URL

## Routes Overview

### Root
- `GET /` - Health check (returns "🎵 Last.fm Proxy API is running!")

### One-time database setup (no shell needed)
- `GET /api/setup-db?secret=YOUR_SETUP_SECRET` - Runs the migration to create `artists` and `albums` tables. Set `SETUP_SECRET` in your backend env (e.g. on Render), then visit this URL once. Safe to run multiple times.

---

## Artist Routes (from `artistRoutes.js`)
Base path: `/`

### Get Top Tracks (Last.fm API - doesn't store)
```
GET /top-tracks?artist=ArtistName
```
**Example:**
```bash
curl "http://localhost:3000/top-tracks?artist=Radiohead"
```

---

## User Routes (from `userRoutes.js`)
Base path: `/api/users`

### Which endpoint for the comparison chart?

| What you want | Endpoint | Notes |
|---------------|----------|--------|
| **Full comparison chart** (album + plays for 1 week, 1 month, 3mo, 6mo, 12mo, overall) | **GET /api/users/localalbumdata** or **GET /api/users/localalbumdata/raw** | Data comes from **PostgreSQL**. Populate first with POST below. |
| Single-period list (artist – album – x plays for one range only) | GET /api/users/usertopalbums?user=...&period=7day | Direct Last.fm API; one period per request. |

The chart that shows “album and plays under each time frame” uses **localalbumdata** (database), not **usertopalbums** (single-period Last.fm list).

---

### 1. Fetch and Store Album Data ⭐ **USE THIS TO POPULATE DATABASE**
```
POST /api/users/localalbumdata
Content-Type: application/json

{
  "username": "your_lastfm_username"
}
```
**What it does:**
- Fetches album data from Last.fm API for all time periods
- Creates/updates artists in database
- Creates/updates albums in database
- Returns saved data

**Example:**
```bash
curl -X POST http://localhost:3000/api/users/localalbumdata \
  -H "Content-Type: application/json" \
  -d '{"username": "frogdunker"}'
```

### 2. Get Stored Album Data (for the full comparison chart)
```
GET /api/users/localalbumdata?username=LASTFM_USERNAME
GET /api/users/localalbumdata
```
**Query:** `username` (optional) – when set, returns only that Last.fm user’s chart; when omitted, returns all albums.

**Returns:** Albums with **play counts per time frame** (one_week, one_month, three_month, six_month, twelve_month, play_count_total). Use for the chart that shows album + plays under each period.

**Response shape (wrapped):** `{ status, message, data: [ { id, title, one_week, one_month, three_month, six_month, twelve_month, play_count_total, image_url, artist: { id, name }, ... } ] }`

**Example:**
```bash
curl "http://localhost:3000/api/users/localalbumdata?username=alice"
```

### 3. Get Stored Album Data (Raw Format)
```
GET /api/users/localalbumdata/raw?username=LASTFM_USERNAME
GET /api/users/localalbumdata/raw
```
**Query:** `username` (optional) – when set, returns only that user’s chart; when omitted, returns all albums. **For /editedchart, pass the search-bar username here so the chart matches the user.**

**Returns:** Same album list as above, in raw JSON array (no status/message wrapper).

### 4. Get All Artists
```
GET /api/users/artists
```
**Returns:** All artists stored in database

**Example:**
```bash
curl http://localhost:3000/api/users/artists
```

### 5. Get Albums by Artist
```
GET /api/users/artists/:artistId/albums
```
**Returns:** All albums for a specific artist

**Example:**
```bash
curl http://localhost:3000/api/users/artists/1/albums
```

### 6. Get User Top Albums – single period (Last.fm API - doesn't store)
```
GET /api/users/usertopalbums?user=username&period=7day&limit=50&page=1
```
**Returns:** A **single-period** list from Last.fm (e.g. artist, album name, one playcount). Not the multi-timeframe comparison chart.

**Parameters:**
- `user` (required) - Last.fm username
- `period` (optional) - 7day, 1month, 3month, 6month, 12month, overall
- `limit` (optional) - Number of results
- `page` (optional) - Page number

**Example:**
```bash
curl "http://localhost:3000/api/users/usertopalbums?user=frogdunker&period=7day"
```

---

## Data Flow Summary

### To Store Data in Database:
1. **POST** to `/api/users/localalbumdata` with your Last.fm username
2. The backend will:
   - Fetch data from Last.fm API
   - Store artists in `artists` table
   - Store albums in `albums` table with play counts

### To Retrieve Stored Data:
- **GET** `/api/users/localalbumdata` - Get all albums
- **GET** `/api/users/artists` - Get all artists
- **GET** `/api/users/artists/:artistId/albums` - Get albums for artist

### Direct Last.fm API Calls (No Storage):
- **GET** `/top-tracks?artist=...` - Top tracks
- **GET** `/api/users/usertopalbums?user=...&period=7day` - User top albums (use `period=7day` for weekly)

---

## Common Issues

### "could not GET routerlink" Error
This error suggests:
1. **Wrong URL** - Check the exact route paths above
2. **Missing base path** - User routes need `/api/users` prefix
3. **Server not running** - Make sure `npm run dev` is running
4. **Frontend issue** - If calling from frontend, check CORS and URL

### Empty Results
- Make sure you've run the **POST** endpoint first to populate the database
- Check your Last.fm username is correct
- Verify `LASTFM_API_KEY` is set in `.env`

### Database Connection Errors
- Verify PostgreSQL is running
- Check `.env` file has correct `DATABASE_URL` or database credentials
- Test: `psql -U postgres -d lastfm_api_project_db`
