import express from "express";
import { getTopAlbums } from "../controllers/userGetTopAlbumsController.js";
import {
  createLocalAlbumData,
  getLocalAlbumData,
  getLocalAlbumDataRaw,
} from "../controllers/localAlbumDataController.js";
import {
  getAllArtists,
  getArtistWithAlbums,
} from "../controllers/artistController.js";

const router = express.Router();
router.get("/usertopalbums", getTopAlbums);
router.post("/localalbumdata", createLocalAlbumData);
router.get("/localalbumdata", getLocalAlbumData);
router.get("/localalbumdata/raw", getLocalAlbumDataRaw);
router.get("/artists", getAllArtists);
router.get("/artists/:artistId/albums", getArtistWithAlbums);

export default router;
