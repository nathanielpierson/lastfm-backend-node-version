// routes/artistRoutes.js

import express from "express";
import { getArtistInfo } from "../controllers/artistController.js";
import { getTopTracks } from "../controllers/topTracksController.js";

const router = express.Router();
router.get("/top-tracks", getTopTracks);
router.get("/", getArtistInfo);

export default router;
