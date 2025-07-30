import axios from "axios";
import { generateApiSig } from "../utils/apiSig.js";

export async function fetchRecentTracks(username, period) {
  const API_KEY = process.env.LASTFM_API_KEY;
  const SHARED_SECRET = process.env.LASTFM_SHARED_SECRET;

  const params = {
    method: "user.getTopAlbums",
    user: username,
    period: period,
    api_key: API_KEY,
    format: "json",
  };

  const apiSig = generateApiSig(params);

  const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
    params: { ...params, apiSig },
  });

  return res.data;
}
