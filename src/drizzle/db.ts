import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { isFeatureEnabled } from "@/lib/features/flags";
import * as schema from "./schema";

let dbInstance: NodePgDatabase<typeof schema> | null = null;

export function getDb(): NodePgDatabase<typeof schema> {
  if (!isFeatureEnabled("enable_database")) {
    throw new Error(
      "Database is disabled. Set ENABLE_DATABASE=true to use Postgres.",
    );
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when ENABLE_DATABASE=true.");
  }

  dbInstance ??= drizzle(databaseUrl, { schema });
  return dbInstance;
}
