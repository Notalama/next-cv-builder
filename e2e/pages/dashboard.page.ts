import type { Page } from "@playwright/test";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
    // Link name is `${title} Updated …` — anchor to avoid matching `${title} (copy)`.
    return this.page.getByRole("link", {
      name: new RegExp(`^${escapeRegExp(title)} Updated`),
    });
  }

  cvListItem(title: string) {
    return this.page.getByRole("listitem").filter({
      has: this.page.getByText(title, { exact: true }),
    });
  }

  deleteCvButton(title: string) {
    return this.cvListItem(title).getByRole("button", {
      name: `Delete ${title}`,
    });
  }

  copyCvButton(title: string) {
    return this.cvListItem(title).getByRole("button", {
      name: `Copy ${title}`,
    });
  }

  async deleteCv(title: string) {
    await this.deleteCvButton(title).click();
  }

  async copyCv(title: string) {
    await this.copyCvButton(title).click();
  }

  async createNewCv() {
    await this.page.getByRole("link", { name: "New CV" }).click();
  }

  async createFirstCv() {
    await this.page.getByRole("link", { name: "Create CV" }).click();
  }
}
