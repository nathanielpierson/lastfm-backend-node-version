import express from "express";
import { getWeeklyAlbumChart } from "../controllers/userWeeklyAlbumChartController.js";
import { getTopAlbums } from "../controllers/userGetTopAlbumsController.js";

const router = express.Router();
router.get("/weekly-chart", getWeeklyAlbumChart);
router.get("/user-top-albums", getTopAlbums);

export default router;
