import fs from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";
import { defineBddConfig } from "playwright-bdd";

loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";
const isCI = Boolean(process.env.CI);
const webServerPort = new URL(baseURL).port || "3001";
const speedReaderEntry =
  process.env.NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY ??
  "http://localhost:3002/mf-manifest.json";
const spriteGeneratorEntry =
  process.env.NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY ??
  "http://localhost:3003/mf-manifest.json";

const testDir = defineBddConfig({
  features: "e2e/features/**/*.feature",
  steps: ["e2e/steps/**/*.ts", "e2e/support/fixtures.ts"],
  outputDir: ".features-gen",
});

function resolveRemoteDir(repoName: string, envKey: string) {
  const fromEnv = process.env[envKey];
  if (fromEnv) {
    return fromEnv;
  }

  const ciDir = path.resolve(process.cwd(), ".remotes", repoName);
  if (fs.existsSync(path.join(ciDir, "package.json"))) {
    return ciDir;
  }

  return path.resolve(process.cwd(), "..", repoName);
}

function webServerEnv(): Record<string, string> {
  const env: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value != null) {
      env[key] = value;
    }
  }

  Object.assign(env, {
    PORT: webServerPort,
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: baseURL,
    POSTMARK: "false",
    EMAIL_CONFIRMATION: "false",
    NEXT_PUBLIC_PASSKEY: "false",
    NEXT_PUBLIC_SPEED_READER: "true",
    NEXT_PUBLIC_SPRITE_GENERATOR: "true",
    NEXT_PUBLIC_IMPORT_SAVED_DATA: "false",
    NEXT_PUBLIC_SOCIAL_AUTH: "false",
    DISABLE_AUTH_RATE_LIMIT: "true",
    AI_IMPROVE_MOCK: "true",
    GEMINI_API_KEY: "",
    ARCJET_API_KEY: "",
    STRIPE_SECRET_KEY: "",
    STRIPE_WEBHOOK_SECRET: "",
    GITHUB_CLIENT_ID: "",
    GITHUB_CLIENT_SECRET: "",
    DISCORD_CLIENT_ID: "",
    DISCORD_CLIENT_SECRET: "",
    NEXT_PUBLIC_SPEED_READER_REMOTE_ENTRY: speedReaderEntry,
    NEXT_PUBLIC_SPRITE_GENERATOR_REMOTE_ENTRY: spriteGeneratorEntry,
  });

  return env;
}

function remotePreviewEnv(port: number): Record<string, string> {
  const env: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value != null) {
      env[key] = value;
    }
  }

  env.VITE_PUBLIC_ORIGIN = `http://localhost:${port}`;
  return env;
}

function remotePreviewCommand(port: number) {
  return `npm install --no-audit --no-fund && npm run build && npm run preview -- --host --port ${port}`;
}

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: isCI ? 15_000 : 10_000,
  },
  reporter: isCI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["list"], ["html", { open: "never" }]],
  globalSetup: "./e2e/support/global-setup.ts",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: remotePreviewCommand(3002),
      cwd: resolveRemoteDir("speed-reader", "SPEED_READER_REMOTE_DIR"),
      url: speedReaderEntry,
      reuseExistingServer: !isCI,
      timeout: 300_000,
      env: remotePreviewEnv(3002),
    },
    {
      command: remotePreviewCommand(3003),
      cwd: resolveRemoteDir("sprite-generator", "SPRITE_GENERATOR_REMOTE_DIR"),
      url: spriteGeneratorEntry,
      reuseExistingServer: !isCI,
      timeout: 300_000,
      env: remotePreviewEnv(3003),
    },
    {
      command: `npm run build && npm run start -- --port ${webServerPort}`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 300_000,
      env: webServerEnv(),
    },
  ],
});
