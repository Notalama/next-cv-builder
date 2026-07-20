import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../src/drizzle/schema";
import { getDatabaseUrl } from "./env";

const TRUNCATE_TABLES = [
  "cv_document",
  "member",
  "session",
  "account",
  "verification",
  "organization",
  "user",
  "two_factor",
  "passkey",
  "invitation",
  "subscription",
] as const;

let client: ReturnType<typeof postgres> | null = null;
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getTestDb() {
  if (db == null) {
    const url = getDatabaseUrl();
    client = postgres(url, { prepare: false, max: 1 });
    db = drizzle(client, { schema });
  }
  return db;
}

export async function closeTestDb() {
  if (client != null) {
    await client.end({ timeout: 5 });
    client = null;
    db = null;
  }
}

async function existingTables(): Promise<Set<string>> {
  const database = getTestDb();
  const result = await database.execute(sql`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  `);

  const rows = result as unknown as { tablename: string }[];
  return new Set(rows.map((row) => row.tablename));
}

export async function truncateAllTables() {
  const database = getTestDb();
  const present = await existingTables();
  const tables = TRUNCATE_TABLES.filter((table) => present.has(table));

  if (tables.length === 0) {
    return;
  }

  const list = tables.map((table) => `"${table}"`).join(", ");
  await database.execute(
    sql.raw(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`),
  );
}

export async function waitForDatabase(retries = 30) {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      await closeTestDb();
      const database = getTestDb();
      await database.execute(sql`SELECT 1`);
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error(
    `Postgres test database did not become ready in time: ${String(lastError)}`,
  );
}
