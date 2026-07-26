import { expect } from "@playwright/test";
import { LANDING_DEMO_PROFILE, LandingPage } from "../pages/landing.page";
import { Then, When } from "../support/fixtures";

When("I open sign in from the landing header", async ({ page }) => {
  const landing = new LandingPage(page);
  await landing.openSignIn();
});

When("I open sign up from the landing header", async ({ page }) => {
  const landing = new LandingPage(page);
  await landing.openSignUp();
});

When("I start from the Try now call to action", async ({ page }) => {
  const landing = new LandingPage(page);
  await landing.startTryNow();
});

When("I follow the brand link", async ({ page }) => {
  const landing = new LandingPage(page);
  await landing.brandLink().click();
});

Then("I am on the landing page", async ({ page }) => {
  const landing = new LandingPage(page);
  await expect(page).toHaveURL("/");
  await expect(landing.heading()).toBeVisible();
});

Then("the landing header offers a link to the dashboard", async ({ page }) => {
  const landing = new LandingPage(page);
  await expect(landing.dashboardLink()).toBeVisible();
});

Then(
  "I see a preview of the {string} template",
  async ({ page }, templateName: string) => {
    const landing = new LandingPage(page);
    const preview = landing.templatePreview(templateName);
    await expect(preview).toBeVisible();
    await expect(preview.getByText(LANDING_DEMO_PROFILE)).toBeVisible();
  },
);

Then(
  "I am on the login page with the {string} tab selected",
  async ({ page }, tabName: string) => {
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(
      page.getByRole("tab", { name: tabName, selected: true }),
    ).toBeVisible();
  },
);
