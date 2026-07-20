import path from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

const required = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
] as const;

export function assertTestEnv() {
  const missing = required.filter((key) => {
    const value = process.env[key];
    return value == null || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required BDD env vars: ${missing.join(", ")}. Copy .env.test.example to .env.test.`,
    );
  }
}

export function getBaseUrl() {
  assertTestEnv();
  return process.env.BETTER_AUTH_URL as string;
}

export function getDatabaseUrl() {
  assertTestEnv();
  return process.env.DATABASE_URL as string;
}
