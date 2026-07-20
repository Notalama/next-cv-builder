import path from "node:path";
import { config as loadEnv } from "dotenv";
import { closeTestDb, truncateAllTables, waitForDatabase } from "./db";
import { assertTestEnv } from "./env";

loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

async function main() {
  assertTestEnv();
  await waitForDatabase();
  await truncateAllTables();
  await closeTestDb();
  console.log("Test database truncated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
