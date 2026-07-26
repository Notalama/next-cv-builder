import { expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";
import { uniqueEmail } from "../support/auth";
import {
  buildUserInput,
  Given,
  signInViaApi,
  signUpViaApi,
  Then,
  When,
} from "../support/fixtures";

Given("I am not signed in", async ({ context }) => {
  await context.clearCookies();
});

Given("I am signed in as a member", async ({ context, asMember }) => {
  void asMember;
  void context;
});

Given("I am signed in as an admin", async ({ context, asAdmin }) => {
  void asAdmin;
  void context;
});

Given(
  "I have registered with email {string} and password {string}",
  async ({ $testInfo }, email: string, password: string) => {
    void $testInfo;
    await signUpViaApi(
      buildUserInput({
        email,
        password,
        name: "Registered User",
      }),
    );
  },
);

When("I visit the dashboard", async ({ page }) => {
  await page.goto("/dashboard");
});

When("I visit the CV builder", async ({ page }) => {
  await page.goto("/cv-builder");
});

When("I visit the login page", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
});

When("I click on sign-up tab", async ({ page }) => {
  await page.getByRole("tab", { name: "Sign Up" }).click();
});

When(
  "I fill the sign-up form as name {string} and password {string}",
  async ({ page }, name: string, password: string) => {
    const email = uniqueEmail("signup");
    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
  },
);

When("I click sign-up button", async ({ page }) => {
  await page.getByRole("button", { name: "Sign Up" }).click();
});

When(
  "I sign in with email {string} and password {string}",
  async ({ page }, email: string, password: string) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.signIn(email, password);
  },
);

When(
  "I sign in via API with email {string} and password {string}",
  async ({ context }, email: string, password: string) => {
    const cookies = await signInViaApi(email, password);
    await context.addCookies(cookies);
  },
);

Then("I am on the sign-up page", async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/sign-up/);
  await expect(page.getByRole("tab", { name: "Sign Up" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

Then("I am redirected to the login page", async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole("tab", { name: "Sign In" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

Then("I am on the dashboard", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(dashboard.heading()).toBeVisible();
});

Then("I see the login form", async ({ page }) => {
  await expect(page.getByRole("tab", { name: "Sign In" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});
