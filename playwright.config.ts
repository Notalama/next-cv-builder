import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";
import { defineBddConfig } from "playwright-bdd";

loadEnv({ path: path.resolve(process.cwd(), ".env.test") });

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3001";
const isCI = Boolean(process.env.CI);
const webServerPort = new URL(baseURL).port || "3001";

const testDir = defineBddConfig({
  features: "e2e/features/**/*.feature",
  steps: ["e2e/steps/**/*.ts", "e2e/support/fixtures.ts"],
  outputDir: ".features-gen",
});

function webServerEnv(): Record<string, string> {
  const env: Record<string, string> = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (value != null) {
      env[key] = value;
    }
  }

  // Force BDD-safe overrides (empty string disables optional integrations).
  Object.assign(env, {
    PORT: webServerPort,
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: baseURL,
    ENABLE_POSTMARK: "false",
    ENABLE_EMAIL_CONFIRMATION: "false",
    NEXT_PUBLIC_ENABLE_PASSKEY: "false",
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
  });

  return env;
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
  webServer: {
    // `next start` can run alongside an existing `next dev` on another port.
    // Build once locally if .next is stale: npm run build
    command: `npm run start -- --port ${webServerPort}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: webServerEnv(),
  },
});
