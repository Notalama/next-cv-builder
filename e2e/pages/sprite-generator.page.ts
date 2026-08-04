import type { Page } from "@playwright/test";

/** Minimal 1×1 opaque red PNG. */
const PNG_1X1_RED = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

/** Minimal 2×2 opaque blue PNG. */
const PNG_2X2_BLUE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNk+M9Qz0AEYBxVSF+FABJADveWkH6aAAAAAElFTkSuQmCC",
  "base64",
);

const FIXTURES: Record<string, { buffer: Buffer; mimeType: string }> = {
  "frame-a.png": { buffer: PNG_1X1_RED, mimeType: "image/png" },
  "frame-b.png": { buffer: PNG_2X2_BLUE, mimeType: "image/png" },
};

export class SpriteGeneratorPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/sprite-generator");
  }

  heading() {
    return this.page.getByRole("heading", {
      name: "Sprite Sheet Generator",
      level: 1,
    });
  }

  backToDashboard() {
    return this.page.getByRole("link", { name: "Back to Dashboard" });
  }

  fileInput() {
    return this.page.getByLabel("PNG frames", { exact: true });
  }

  createSpriteButton() {
    return this.page.getByRole("button", { name: "Create Sprite" });
  }

  downloadButton() {
    return this.page.getByRole("button", {
      name: "Download Sprite Sheet (.png)",
    });
  }

  resultSection() {
    return this.page.getByLabel("Generated sprite sheet", { exact: true });
  }

  uploadedFrames() {
    return this.page.getByRole("list", { name: "Uploaded frames" }).getByRole(
      "listitem",
    );
  }

  async uploadFrames(...fileNames: string[]) {
    const files = fileNames.map((name) => {
      const fixture = FIXTURES[name];
      if (fixture == null) {
        throw new Error(`Unknown sprite fixture: ${name}`);
      }
      return {
        name,
        mimeType: fixture.mimeType,
        buffer: fixture.buffer,
      };
    });
    await this.fileInput().setInputFiles(files);
  }

  async createSprite() {
    await this.createSpriteButton().click();
    await this.resultSection().waitFor({ state: "visible" });
  }
}
