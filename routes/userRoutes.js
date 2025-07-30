import express from "express";
import { getWeeklyAlbumChart } from "../controllers/userWeeklyAlbumChartController.js";
import { getTopAlbums } from "../controllers/userGetTopAlbumsController.js";
import {
  createLocalAlbumData,
  getLocalAlbumData,
} from "../controllers/localAlbumDataController.js";

const router = express.Router();
router.get("/weeklychart", getWeeklyAlbumChart);
router.get("/usertopalbums", getTopAlbums);
router.post("/localalbumdata", createLocalAlbumData);
router.get("/localalbumdata", getLocalAlbumData);

export default router;
