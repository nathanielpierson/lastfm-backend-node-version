import axios from "axios";
import { generateApiSig } from "../utils/apiSig.js";

export async function fetchRecentTracks(username) {
  const API_KEY = process.env.LASTFM_API_KEY;
  const SHARED_SECRET = process.env.LASTFM_SHARED_SECRET;

  const params = {
    method: "user.getrecenttracks",
    user: username,
    api_key: API_KEY,
    format: "json",
  };

  const api_sig = generateApiSig(params);

  const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
    params: { ...params, api_sig },
  });

  return res.data;
}
