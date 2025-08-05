import { fetchRecentTracks } from "../services/lastfmService.js";
import {
  createArtistService,
  findArtistByNameService,
} from "../services/artistService.js";
import {
  createAlbumService,
  getAllAlbumsWithArtistsService,
  updateAlbumIgnoredStatusService,
  getAllAlbumsWithArtistsIncludingIgnoredService,
} from "../services/albumService.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

// Helper function to extract medium image URL from Last.fm API response
const extractMediumImageUrl = (album) => {
  if (album.image && Array.isArray(album.image)) {
    const mediumImage = album.image.find((img) => img.size === "medium");
    return mediumImage ? mediumImage["#text"] : null;
  }
  return null;
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
        console.log(
          `Data for period ${mapping.period}:`,
          JSON.stringify(data, null, 2)
        );
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
        console.log("Processing album:", JSON.stringify(album, null, 2));

        // Check if album.title exists, if not try album.name
        const albumTitle = album.title || album.name;
        const artistName = album.artist?.name || album.artist;

        if (!albumTitle || !artistName) {
          console.warn("Skipping album with missing title or artist:", album);
          continue;
        }

        const albumKey = `${albumTitle}-${artistName}`;
        const playCount = parseInt(album.playcount) || 0;
        const imageUrl = extractMediumImageUrl(album);

        if (!albumMap.has(albumKey)) {
          albumMap.set(albumKey, {
            title: albumTitle,
            artist_name: artistName,
            image_url: imageUrl,
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

        // Update image_url if we don't have one yet
        if (!albumData.image_url && imageUrl) {
          albumData.image_url = imageUrl;
        }
      }
    }

    console.log("Final album map:", Array.from(albumMap.entries()));

    // Convert map to array and save to database
    const transformedAlbums = Array.from(albumMap.values());
    const savedAlbums = [];

    for (const albumData of transformedAlbums) {
      console.log("Saving album data:", albumData);

      // First, create or find the artist
      let artist = await findArtistByNameService(albumData.artist_name);
      if (!artist) {
        artist = await createArtistService(albumData.artist_name);
      }

      // Then create the album with the artist_id (remove artist_name from the data)
      const { artist_name, ...albumDataWithoutArtistName } = albumData;
      const albumWithArtistId = {
        ...albumDataWithoutArtistName,
        artist_id: artist.id,
      };

      console.log("Album with artist_id:", albumWithArtistId);

      const savedAlbum = await createAlbumService(albumWithArtistId);
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
    const albumData = await getAllAlbumsWithArtistsService();
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

export const getLocalAlbumDataRaw = async (req, res, next) => {
  try {
    const albumData = await getAllAlbumsWithArtistsService();
    res.status(200).json(albumData);
  } catch (error) {
    console.error("Error fetching local album data:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAlbumIgnoredStatus = async (req, res, next) => {
  const { albumId } = req.params;
  const { ignored } = req.body;

  try {
    const updatedAlbum = await updateAlbumIgnoredStatusService(
      albumId,
      ignored
    );
    handleResponse(
      res,
      200,
      "Album ignored status updated successfully",
      updatedAlbum
    );
  } catch (error) {
    console.error("Error updating album ignored status:", error);
    handleResponse(res, 500, "Error updating album ignored status", {
      error: error.message,
    });
  }
};

export const getAllAlbumsIncludingIgnored = async (req, res, next) => {
  try {
    const albumData = await getAllAlbumsWithArtistsIncludingIgnoredService();
    handleResponse(
      res,
      200,
      "All albums retrieved successfully (including ignored)",
      albumData
    );
  } catch (error) {
    console.error("Error fetching all albums:", error);
    handleResponse(res, 500, "Error fetching all albums", {
      error: error.message,
    });
  }
};
