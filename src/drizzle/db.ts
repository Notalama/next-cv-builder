import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { isFeatureEnabled } from "@/lib/features/flags";
import * as schema from "./schema";

let dbInstance: PostgresJsDatabase<typeof schema> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!isFeatureEnabled("enable_database")) {
    throw new Error(
      "Database is disabled. Set ENABLE_DATABASE=true to use Postgres.",
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when ENABLE_DATABASE=true.");
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode
  dbInstance ??= drizzle(postgres(databaseUrl, { prepare: false }), {
    schema,
  });
  return dbInstance;
}
