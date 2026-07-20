import type { Page } from "@playwright/test";

export class CvBuilderPage {
  constructor(private readonly page: Page) {}

  heading() {
    return this.page.getByRole("heading", {
      name: "CV Blueprint Creator",
      level: 1,
    });
  }

  async fillFullName(name: string) {
    await this.page.getByLabel("Full Name").fill(name);
  }

  async applyPreset() {
    await this.page.getByRole("button", { name: "Apply preset" }).click();
  }

  async save() {
    await this.page.getByRole("button", { name: "Save CV" }).click();
  }

  async selectTemplate(label: string) {
    await this.page
      .getByRole("button", { name: /Classic Sidebar|Minimal/ })
      .click();
    await this.page.getByRole("menuitemradio", { name: label }).click();
  }

  async exportPdf() {
    await this.page.getByRole("button", { name: /Export PDF|Download PDF/i }).click();
  }
}
