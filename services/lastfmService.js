import axios from "axios";

/** user.getTopAlbums for one period (api_key only; Last.fm expects `api_sig`, not `apiSig`). */
export async function fetchRecentTracks(username, period) {
  const API_KEY = process.env.LASTFM_API_KEY;
  const limit =
    period === "6month" ? 400 : period === "overall" ? 800 : 250;

  const params = {
    method: "user.getTopAlbums",
    user: username,
    period,
    limit,
    api_key: API_KEY,
    format: "json",
  };

  const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
    params,
  });

  return res.data;
}
