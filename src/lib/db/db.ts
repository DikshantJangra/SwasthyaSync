import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

import { env } from "@/lib/env";

const connectionString = env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is missing!");
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString?.includes("localhost") ? false : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
export type Db = typeof db;
