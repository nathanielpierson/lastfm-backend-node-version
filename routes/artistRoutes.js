// routes/artistRoutes.js

import express from "express";
import { getArtistInfo } from "../controllers/artistController.js";

const router = express.Router();

router.get("/info", getArtistInfo);

export default router;
