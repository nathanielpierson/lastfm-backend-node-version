import { getAllArtistsService } from "../services/artistService.js";
import { getAlbumsByArtistService } from "../services/albumService.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const getAllArtists = async (req, res, next) => {
  try {
    const artists = await getAllArtistsService();
    handleResponse(res, 200, "Artists retrieved successfully", artists);
  } catch (error) {
    console.error("Error fetching artists:", error);
    handleResponse(res, 500, "Error fetching artists", {
      error: error.message,
    });
  }
};

export const getArtistWithAlbums = async (req, res, next) => {
  const { artistId } = req.params;

  try {
    const albums = await getAlbumsByArtistService(artistId);
    handleResponse(res, 200, "Artist albums retrieved successfully", albums);
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    handleResponse(res, 500, "Error fetching artist albums", {
      error: error.message,
    });
  }
};
