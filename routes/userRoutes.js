import express from "express";
import { getWeeklyAlbumChart } from "../controllers/userWeeklyAlbumChartController.js";
import { getTopAlbums } from "../controllers/userGetTopAlbumsController.js";

const router = express.Router();
router.get("/weeklychart", getWeeklyAlbumChart);
router.get("/usertopalbums", getTopAlbums);

export default router;
