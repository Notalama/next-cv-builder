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

  renameCvButton(title: string) {
    return this.cvListItem(title).getByRole("button", {
      name: `Rename ${title}`,
    });
  }

  renameDialog() {
    return this.page.getByRole("dialog", { name: "Rename CV" });
  }

  renameField() {
    return this.renameDialog().getByLabel("CV name", { exact: true });
  }

  async deleteCv(title: string) {
    await this.deleteCvButton(title).click();
  }

  async copyCv(title: string) {
    await this.copyCvButton(title).click();
  }

  async openRename(title: string) {
    await this.renameCvButton(title).click();
    await this.renameDialog().waitFor({ state: "visible" });
  }

  async renameCv(title: string, newTitle: string) {
    await this.openRename(title);
    await this.renameField().fill(newTitle);
    await this.renameDialog().getByRole("button", { name: "Save" }).click();
  }

  async setRenameField(value: string) {
    await this.renameField().fill(value);
  }

  async cancelRename() {
    await this.renameDialog().getByRole("button", { name: "Cancel" }).click();
  }

  async createNewCv() {
    await this.page.getByRole("link", { name: "New CV" }).click();
  }

  async createFirstCv() {
    await this.page.getByRole("link", { name: "Create CV" }).click();
  }

  spriteGeneratorLink() {
    return this.page.getByRole("link", { name: "Sprite Sheet Generator" });
  }

  async openSpriteGenerator() {
    await this.spriteGeneratorLink().click();
  }
}
