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

  cvListItem(title: string) {
    return this.page.getByRole("listitem").filter({ hasText: title });
  }

  deleteCvButton(title: string) {
    return this.cvListItem(title).getByRole("button", {
      name: `Delete ${title}`,
    });
  }

  async deleteCv(title: string) {
    await this.deleteCvButton(title).click();
  }

  async createNewCv() {
    await this.page.getByRole("button", { name: "New CV" }).click();
  }

  async createFirstCv() {
    await this.page.getByRole("button", { name: "Create CV" }).click();
  }
}
