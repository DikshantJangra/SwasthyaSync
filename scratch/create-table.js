import pg from "pg";

async function createTable() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Creating health_metrics table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "health_metrics" (
        "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (increment 1 start 1 minvalue 1 maxvalue 2147483647 cache 1),
        "userId" text NOT NULL,
        "type" text NOT NULL,
        "value" integer NOT NULL,
        "unit" text,
        "timestamp" timestamp NOT NULL DEFAULT now()
      );
    `);
    console.log("✅ health_metrics table created successfully!");
  } catch (err) {
    console.error("❌ Failed to create table:", err);
  } finally {
    await pool.end();
  }
}

createTable();
