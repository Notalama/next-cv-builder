import { execSync } from "node:child_process";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { closeTestDb, truncateAllTables, waitForDatabase } from "./db";
import { assertTestEnv } from "./env";

loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

function applySchema() {
  const env = {
    ...process.env,
    NODE_ENV: "test",
  };

  try {
    execSync("npx cross-env NODE_ENV=test drizzle-kit migrate", {
      stdio: "inherit",
      env,
    });
  } catch {
    // Remote/shared test DBs may already have tables without a migrations journal.
    execSync("npx cross-env NODE_ENV=test drizzle-kit push", {
      stdio: "inherit",
      env,
    });
  }
}

export default async function globalSetup() {
  assertTestEnv();
  await waitForDatabase();
  applySchema();
  await truncateAllTables();
  await closeTestDb();
}
