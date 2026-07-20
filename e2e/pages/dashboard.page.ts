import type { Page } from "@playwright/test";

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/dashboard");
  }

  heading() {
    return this.page.getByRole("heading", { name: "Dashboard", level: 1 });
  }

  emptyState() {
    return this.page.getByText("No CVs yet");
  }

  cvLink(title: string) {
    return this.page.getByRole("link", { name: new RegExp(title) });
  }

  async createNewCv() {
    await this.page.getByRole("button", { name: "New CV" }).click();
  }

  async createFirstCv() {
    await this.page.getByRole("button", { name: "Create CV" }).click();
  }
}
