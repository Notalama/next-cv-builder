import path from "node:path";
import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const isTest = process.env.NODE_ENV === "test";
const envFile = isTest ? ".env.test" : ".env";

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

if (!isTest) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env (or .env.test when NODE_ENV=test).",
  );
}

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
