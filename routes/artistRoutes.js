import express from "express";
import { getTopTracks } from "../controllers/topTracksController.js";

const router = express.Router();
router.get("/top-tracks", getTopTracks);

export default router;
