import path from "node:path";
import type { Download, Page } from "@playwright/test";

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

const SAMPLE_VIDEO_PATH = path.join(process.cwd(), "e2e/data/sample-clip.mp4");

const lastVideoDownloads = new WeakMap<Page, Download>();

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

  videoFileInput() {
    return this.page.getByLabel("MP4 video", { exact: true });
  }

  createSpriteButton() {
    return this.page.getByRole("button", { name: "Create Sprite" });
  }

  convertVideoButton() {
    return this.page.getByRole("button", { name: "Convert video to PNGs" });
  }

  downloadVideoFramesButton() {
    return this.page.getByRole("button", { name: "Download video frames" });
  }

  videoFramesReadyText() {
    return this.page.getByText(/\d+ PNG frames? ready to download/);
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
    return this.page
      .getByRole("list", { name: "Uploaded frames" })
      .getByRole("listitem");
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

  async chooseSampleVideo() {
    await this.videoFileInput().setInputFiles(SAMPLE_VIDEO_PATH);
  }

  async createSprite() {
    await this.createSpriteButton().click();
    await this.resultSection().waitFor({ state: "visible" });
  }

  async convertVideo() {
    await this.convertVideoButton().click();
    await this.videoFramesReadyText().waitFor({ state: "visible" });
  }

  async downloadVideoFramesZip() {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.downloadVideoFramesButton().click(),
    ]);
    lastVideoDownloads.set(this.page, download);
  }

  getLastVideoDownload() {
    return lastVideoDownloads.get(this.page) ?? null;
  }
}
