import "dotenv/config";
import { pool } from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");

    // Read the migration SQL file (handles both new and existing databases)
    const sqlPath = path.join(__dirname, "..", "database", "migration.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Execute the migration SQL
    await pool.query(sqlContent);

    console.log("✅ Database migration completed successfully!");
    console.log('📊 Tables "artists" and "albums" are ready.');
    console.log(
      "🔗 Foreign key relationship established between artists and albums."
    );
    console.log(
      '🖼️ "image_url" column added to albums table for album artwork.'
    );
    console.log('🚫 "ignored" column added to albums table for filtering.');
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
