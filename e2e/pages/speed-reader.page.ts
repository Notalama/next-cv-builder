import type { Page } from "@playwright/test";

export class SpeedReaderPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/cv-builder/speed-reader");
  }

  heading() {
    return this.page.getByRole("heading", { name: "Speed Reader", level: 1 });
  }

  backToDashboard() {
    return this.page.getByRole("link", { name: "Back to Dashboard" });
  }

  textInput() {
    return this.page.getByPlaceholder(
      "Paste or type the text you want to speed-read…",
    );
  }

  playButton() {
    return this.page.getByRole("button", { name: "Play" });
  }
}
