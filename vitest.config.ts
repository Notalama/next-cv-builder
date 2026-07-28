import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = fileURLToPath(new URL("./", import.meta.url));

const alias = {
  "@": path.resolve(dirname, "./src"),
};

const unitTest = {
  root,
  environment: "jsdom" as const,
  include: ["src/**/*.{test,spec}.{ts,tsx}"],
  setupFiles: ["./src/test/setup.ts"],
  css: false,
};

export default defineConfig(async () => {
  if (process.env.VITEST_STORYBOOK !== "true") {
    return {
      root,
      resolve: { alias },
      test: unitTest,
    };
  }

  const { storybookTest } = await import(
    "@storybook/addon-vitest/vitest-plugin"
  );
  const { playwright } = await import("@vitest/browser-playwright");

  return {
    root,
    resolve: { alias },
    test: {
      projects: [
        {
          root,
          resolve: { alias },
          test: { ...unitTest, name: "unit" },
        },
        {
          extends: true,
          plugins: [
            storybookTest({ configDir: path.join(dirname, ".storybook") }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({}),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  };
});
