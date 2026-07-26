import type { Page } from "@playwright/test";

export const LANDING_HERO_HEADING = "Build a CV recruiters actually read";
export const LANDING_DEMO_PROFILE = "Alex Morgan";

export class LandingPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  heading() {
    return this.page.getByRole("heading", {
      name: LANDING_HERO_HEADING,
      level: 1,
    });
  }

  header() {
    return this.page.getByRole("banner");
  }

  brandLink() {
    return this.page.getByRole("link", { name: "CV Builder" });
  }

  dashboardLink() {
    return this.header().getByRole("link", { name: "Dashboard" });
  }

  signInLink() {
    return this.header().getByRole("link", { name: "Sign in" });
  }

  signUpLink() {
    return this.header().getByRole("link", { name: "Sign up" });
  }

  tryNowLink() {
    return this.page.getByRole("link", { name: "Try now" });
  }

  templatePreview(templateName: string) {
    return this.page.getByRole("listitem").filter({
      has: this.page.getByRole("heading", { name: templateName, level: 3 }),
    });
  }

  async openSignIn() {
    await this.signInLink().click();
  }

  async openSignUp() {
    await this.signUpLink().click();
  }

  async startTryNow() {
    await this.tryNowLink().click();
  }
}
