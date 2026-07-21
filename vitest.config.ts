import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const alias = {
  "@": path.resolve(dirname, "./src"),
};

// The storybook plugin boots Storybook's preset loader as soon as it is
// imported, even when running `--project unit`. Load it lazily so plain unit
// runs don't depend on the Storybook toolchain.
export default defineConfig(async () => {
  const projects: object[] = [
    {
      resolve: { alias },
      test: {
        name: "unit",
        environment: "jsdom",
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        setupFiles: ["./src/test/setup.ts"],
        css: false,
      },
    },
  ];

  if (process.env.VITEST_STORYBOOK === "true") {
    const { storybookTest } = await import(
      "@storybook/addon-vitest/vitest-plugin"
    );
    const { playwright } = await import("@vitest/browser-playwright");

    projects.push({
      extends: true,
      plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
      test: {
        name: "storybook",
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{ browser: "chromium" }],
        },
      },
    });
  }

  return {
    resolve: { alias },
    test: { projects },
  };
});
