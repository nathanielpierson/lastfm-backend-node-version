import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * New Postgres DBs have no tables until migration runs. Chart generation only INSERTs.
 * If `albums` is missing, run migration.sql once against DATABASE_URL.
 *
 * Always logs a short DB status line so Render logs show what happened (migration
 * messages only appear when the table was missing).
 */
export async function ensureSchemaIfNeeded(pool) {
  const urlSet = Boolean(process.env.DATABASE_URL);
  console.log(
    `[db] DATABASE_URL ${urlSet ? "is set (using Render/hosted Postgres)" : "is NOT set — falling back to DB_* / localhost"}`
  );

  let tableExists = false;
  try {
    const { rows } = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'albums'
      ) AS ok
    `);
    tableExists = Boolean(rows[0]?.ok);
  } catch (e) {
    console.error("[db] Could not check for albums table (connection failed?):", e.message);
    throw e;
  }

  if (!tableExists) {
    const sqlPath = path.join(__dirname, "..", "database", "migration.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    console.log("[db] No public.albums table — running database/migration.sql …");
    await pool.query(sql);
    console.log("[db] Schema ready (artists + albums).");
  } else {
    console.log("[db] public.albums already exists — skipping migration.");
  }

  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::bigint AS n FROM public.albums"
    );
    const n = rows[0]?.n ?? 0;
    console.log(`[db] albums row count: ${n} (0 means generate-chart has not stored data yet, or Last.fm returned no albums)`);
  } catch (e) {
    console.warn("[db] Could not count albums:", e.message);
  }
}
