import crypto from "crypto";

export function generateApiSig(params) {
  const sortedKeys = Object.keys(params).sort();
  let sig = "";
  for (let key of sortedKeys) {
    sig += key + params[key];
  }
  sig += process.env.LASTFM_SHARED_SECRET;

  return crypto.createHash("md5").update(sig).digest("hex");
}
