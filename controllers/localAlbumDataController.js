import { fetchRecentTracks } from "../services/lastfmService.js";
import {
  createLocalAlbumDataService,
  getLocalAlbumDataService,
} from "../services/localAlbumDataService.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createLocalAlbumData = async (req, res, next) => {
  const { username } = req.body;

  try {
    // Define the period mappings
    const periodMappings = [
      { period: "overall", field: "play_count_total" },
      { period: "7day", field: "one_week" },
      { period: "1month", field: "one_month" },
      { period: "3month", field: "three_month" },
      { period: "6month", field: "six_month" },
      { period: "12month", field: "twelve_month" },
    ];

    // Fetch data for all periods
    const periodData = {};
    for (const mapping of periodMappings) {
      try {
        const data = await fetchRecentTracks(username, mapping.period);
        periodData[mapping.period] = data.topalbums.album;
      } catch (error) {
        console.error(
          `Error fetching data for period ${mapping.period}:`,
          error
        );
        periodData[mapping.period] = [];
      }
    }

    // Create a map to aggregate album data across all periods
    const albumMap = new Map();

    // Process each period's data
    for (const mapping of periodMappings) {
      const albums = periodData[mapping.period];

      for (const album of albums) {
        const albumKey = `${album.name}-${album.artist.name}`;
        const playCount = parseInt(album.playcount) || 0;

        if (!albumMap.has(albumKey)) {
          albumMap.set(albumKey, {
            title: album.name,
            artist_name: album.artist.name,
            one_week: 0,
            one_month: 0,
            three_month: 0,
            six_month: 0,
            twelve_month: 0,
            play_count_total: 0,
          });
        }

        const albumData = albumMap.get(albumKey);
        albumData[mapping.field] = playCount;
      }
    }

    // Convert map to array and save to database
    const transformedAlbums = Array.from(albumMap.values());
    const savedAlbums = [];

    for (const albumData of transformedAlbums) {
      const savedAlbum = await createLocalAlbumDataService(albumData);
      savedAlbums.push(savedAlbum);
    }

    handleResponse(res, 201, "Local album data created successfully", {
      totalAlbums: savedAlbums.length,
      albums: savedAlbums,
    });
  } catch (error) {
    console.error("Error creating local album data:", error);
    handleResponse(res, 500, "Error creating local album data", {
      error: error.message,
    });
  }
};

export const getLocalAlbumData = async (req, res, next) => {
  try {
    const albumData = await getLocalAlbumDataService();
    handleResponse(
      res,
      200,
      "Local album data retrieved successfully",
      albumData
    );
  } catch (error) {
    console.error("Error fetching local album data:", error);
    handleResponse(res, 500, "Error fetching local album data", {
      error: error.message,
    });
  }
};
