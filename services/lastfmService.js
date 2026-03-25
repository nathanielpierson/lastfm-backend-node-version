import axios from "axios";

/** user.getTopAlbums for one period (api_key only). */
export async function fetchRecentTracks(username, period) {
  const API_KEY = process.env.LASTFM_API_KEY?.trim();
  if (!API_KEY) {
    throw new Error(
      "LASTFM_API_KEY is missing or empty. Add it to the production host environment (Render: Dashboard → your service → Environment), same value as in local .env."
    );
  }

  const user = typeof username === "string" ? username.trim() : "";
  if (!user) {
    throw new Error("Last.fm user is missing or empty.");
  }

  const limit =
    period === "6month" ? 400 : period === "overall" ? 800 : 250;

  const params = {
    method: "user.getTopAlbums",
    user,
    period,
    limit,
    api_key: API_KEY,
    format: "json",
  };

  try {
    const res = await axios.get("https://ws.audioscrobbler.com/2.0/", {
      params,
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data != null) {
      const d = err.response.data;
      const detail =
        typeof d === "object" && d !== null && "message" in d
          ? String(d.message)
          : JSON.stringify(d);
      throw new Error(
        `Last.fm HTTP ${err.response.status} (${period}): ${detail}`
      );
    }
    throw err;
  }
}
