import type { Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/auth/login");
  }

  async openSignInTab() {
    await this.page.getByRole("tab", { name: "Sign In" }).click();
  }

  async openSignUpTab() {
    await this.page.getByRole("tab", { name: "Sign Up" }).click();
  }

  async signIn(email: string, password: string) {
    await this.openSignInTab();
    await this.page.getByLabel("Email").fill(email);
    await this.page.getByLabel("Password", { exact: true }).fill(password);
    await this.page.getByRole("button", { name: "Sign In" }).click();
  }

  async signUp(input: { name: string; email: string; password: string }) {
    await this.openSignUpTab();
    await this.page.getByLabel("Name").fill(input.name);
    await this.page.getByLabel("Email").fill(input.email);
    await this.page
      .getByLabel("Password", { exact: true })
      .fill(input.password);
    await this.page.getByRole("button", { name: "Sign Up" }).click();
  }
}
