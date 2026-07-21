import type { Page } from "@playwright/test";

export class CvBuilderPage {
  constructor(private readonly page: Page) {}

  heading() {
    return this.page.getByRole("heading", {
      name: "CV Blueprint Creator",
      level: 1,
    });
  }

  saveButton() {
    return this.page.getByRole("button", { name: "Save CV" });
  }

  formScrollContainer() {
    return this.page.locator(".cv-hide-on-print.overflow-y-auto").first();
  }

  scrollToTopButton() {
    return this.page.getByRole("button", { name: "Scroll to top" });
  }

  scrollToBottomButton() {
    return this.page.getByRole("button", { name: "Scroll to bottom" });
  }

  async fillFullName(name: string) {
    await this.page.getByLabel("Full Name").fill(name);
  }

  async applyPreset() {
    await this.page.getByRole("button", { name: "Apply preset" }).click();
  }

  async save() {
    await this.saveButton().click();
  }

  async selectTemplate(label: string) {
    await this.page
      .getByRole("button", { name: /Classic Sidebar|Minimal/ })
      .click();
    await this.page.getByRole("menuitemradio", { name: label }).click();
  }

  async exportPdf() {
    await this.page
      .getByRole("button", { name: /Export PDF|Download PDF/i })
      .click();
  }

  async scrollFormToBottom() {
    const container = this.formScrollContainer();
    await container.evaluate((element) => {
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" });
    });
  }

  async scrollFormToTop() {
    const container = this.formScrollContainer();
    await container.evaluate((element) => {
      element.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  async clickScrollToTop() {
    await this.scrollToTopButton().click();
  }

  async clickScrollToBottom() {
    await this.scrollToBottomButton().click();
  }

  improveTextButton(fieldLabel: string) {
    return this.page
      .getByRole("button", {
        name: `Improve ${fieldLabel} text`,
      })
      .first();
  }

  fieldByLabel(fieldLabel: string) {
    return this.page.getByLabel(fieldLabel, { exact: true }).first();
  }

  async improveTextFor(fieldLabel: string) {
    const field = this.fieldByLabel(fieldLabel);
    await field.scrollIntoViewIfNeeded();
    await this.improveTextButton(fieldLabel).click();
    await this.page.getByText(/Text improved/).waitFor({ state: "visible" });
  }

  vacancyDescriptionField() {
    return this.page.getByLabel("Vacancy Description", { exact: true });
  }

  generateCvButton() {
    return this.page.getByRole("button", {
      name: "Generate perfect CV for the vacancy",
    });
  }

  async fillVacancyDescription(text: string) {
    const field = this.vacancyDescriptionField();
    await field.scrollIntoViewIfNeeded();
    await field.fill(text);
  }

  async generatePerfectCv() {
    await this.generateCvButton().click();
    await this.page
      .getByText(/CV generated for vacancy/)
      .waitFor({ state: "visible" });
  }
}
