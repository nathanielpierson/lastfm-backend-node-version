import "dotenv/config";
import { pool } from "../config/database.js";
import { runMigrationStatements } from "../config/ensureSchema.js";

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");

    await runMigrationStatements(pool);

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
