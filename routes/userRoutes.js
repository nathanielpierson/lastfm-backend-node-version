import express from "express";
import { getWeeklyAlbumChart } from "./controllers/userWeeklyAlbumChartController.js";

const router = express.Router();
router.get("/weekly-chart", getWeeklyAlbumChart);

export default router;
