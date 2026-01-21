# Last.fm Album Timeframe Aggregation – Backend

## Overview

This is the backend service for a portfolio project that enhances Last.fm listening data by aggregating album play counts across multiple overlapping timeframes.

The Last.fm API provides “top albums” for a single timeframe at a time, but it does not offer historical breakdowns that allow direct comparison (for example, seeing how an album’s popularity changes between 3 months and 6 months).

This backend solves that limitation by:

- Making multiple Last.fm API requests across different time ranges
- Normalizing the results into a single data model
- Persisting derived play count data in a PostgreSQL database
- Exposing clean, consistent album data for a frontend charting UI

This project is currently intended for local development only and exists as a portfolio piece. It may be made publicly available in the future depending on interest and available time.

---

## The purpose of having a backend for this app

Last.fm’s API returns album play counts like this:

- “Top albums in the past 3 months”
- “Top albums in the past 6 months”

Each request is isolated. There is no built-in way to look up a specific album and return data from different periods for that specific album.
To create a new data set that comes as close to doing such a search as possible within the confines of the API, this backend:

1. Fetches album data from multiple timeframes
2. Matches albums across responses
3. Stores each timeframe’s play count as a derived field
4. Returns normalized album records to the frontend

---

## High-Level Architecture

Frontend → Backend API → Last.fm API (multiple timeframe requests) →  
Data normalization & aggregation → PostgreSQL → Normalized album data

---

## Core Concepts

### Timeframe Aggregation

Each album record stores play counts across several fixed time ranges:

- `one_week`
- `one_month`
- `three_month`
- `six_month`
- `twelve_month`
- `play_count_total`

These values are not native to Last.fm as a single dataset — they are derived by combining multiple API responses. (However, these 6 options are the only time frames the API allows for you to search by.)

---

### Normalized Album & Artist Data

Albums are stored separately from artists and associated via foreign keys. Album records include:

- Title
- Artist reference
- Play counts per timeframe
- Total play count
- Album artwork URL
- Creation and update timestamps

Albums can be marked as `ignored`, allowing the frontend to filter out noise without deleting data.

---

### Idempotent Upserts

Album data is inserted using conflict-aware upserts:

- Albums are uniquely identified by `(title, artist_id)`
- Existing records are updated when new timeframe data is fetched
- Repeated syncs remain safe and consistent

---

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Last.fm API
- `pg`

---

## Local Setup

### Prerequisites

- Node.js
- PostgreSQL
- A Last.fm API key

### Environment Variables

Create a `.env` file with the following values:

```env
LASTFM_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/lastfm_api_project_db
PORT=3000
````

Alternatively, provide PostgreSQL values individually:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lastfm_api_project_db
DB_USER=postgres
DB_PASSWORD=
```

---

### Installation

```bash
npm install
```

### Run the Server

```bash
npm run dev
```

---

## Portfolio Notes

This backend was built to demonstrate:

* API data aggregation beyond simple proxying
* Handling fragmented third-party data
* Intentional database modeling with minimal external input
* Clean separation of controllers, services, and persistence layers
