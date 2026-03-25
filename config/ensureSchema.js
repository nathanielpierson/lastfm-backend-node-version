import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * If the database has no `albums` table (e.g. new Render Postgres), run migration.sql.
 * Safe to call on every deploy; only runs SQL when the table is missing.
 */
export async function ensureSchemaIfNeeded(pool) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'albums'
    ) AS exists;
  `);
  if (result.rows[0]?.exists) {
    return;
  }
  const sqlPath = path.join(__dirname, "..", "database", "migration.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf8");
  console.log("Database has no albums table; applying migration.sql …");
  await pool.query(sqlContent);
  console.log("Migration applied: artists and albums are ready.");
}

/**
 * Run the full migration file (idempotent). Used by /api/setup-db.
 */
export async function runMigration(pool) {
  const sqlPath = path.join(__dirname, "..", "database", "migration.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf8");
  await pool.query(sqlContent);
}
