import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * New Render Postgres databases are empty: no tables. Chart generation only INSERTs.
 * On startup, if `albums` is missing, run migration.sql once against DATABASE_URL.
 */
export async function ensureSchemaIfNeeded(pool) {
  const { rows } = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'albums'
    ) AS ok
  `);
  if (rows[0]?.ok) return;

  const sqlPath = path.join(__dirname, "..", "database", "migration.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  console.log("No albums table found — running database/migration.sql on DATABASE_URL …");
  await pool.query(sql);
  console.log("Schema ready (artists + albums).");
}
