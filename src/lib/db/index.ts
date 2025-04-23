import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.SUPABASE_DB_URL) {
  throw new Error("SUPABASE_DB_URL is not defined");
}

const sql = postgres(process.env.SUPABASE_DB_URL, {
  max: 20, // Connection pool size
  idle_timeout: 30, // Close idle connections after 30 seconds
});

export const db = drizzle(sql);