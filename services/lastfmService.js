import axios from "axios";
import { generateApiSig } from "../utils/apiSig.js";

export async function fetchRecentTracks(username, period) {
  const API_KEY = process.env.LASTFM_API_KEY;
  const SHARED_SECRET = process.env.LASTFM_SHARED_SECRET;
  var limit = 150;
  if (period === "six month") {
    limit = 400;
  } else if (period === "overall") {
    limit = 800;
  } else {
    limit = 250;
  }

  const params = {
    method: "user.getTopAlbums",
    user: username,
    period: period,
    limit: limit,
    api_key: API_KEY,
    format: "json",
  };

  const apiSig = generateApiSig(params);

  const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
    params: { ...params, apiSig },
  });

  return res.data;
}
