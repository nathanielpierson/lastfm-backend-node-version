import { Pool } from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure database connection
let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "lastfm_api_project_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  });
}

async function setupDatabase() {
  try {
    console.log("🔧 Setting up database...");

    // Read the SQL file
    const sqlPath = path.join(
      __dirname,
      "..",
      "database",
      "local_album_data.sql"
    );
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Execute the SQL
    await pool.query(sqlContent);

    console.log("✅ Database setup completed successfully!");
    console.log('📊 Table "local_album_data" has been created.');
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
