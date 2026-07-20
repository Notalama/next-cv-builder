import { expect } from "@playwright/test";
import { CvBuilderPage } from "../pages/cv-builder.page";
import { DashboardPage } from "../pages/dashboard.page";
import { Then, When } from "../support/fixtures";

When("I create a new CV from the dashboard", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  const empty = dashboard.emptyState();
  if (await empty.isVisible().catch(() => false)) {
    await dashboard.createFirstCv();
  } else {
    await dashboard.createNewCv();
  }
});

When("I open the CV titled {string}", async ({ page }, title: string) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await dashboard.cvLink(title).click();
});

Then("I am in the CV builder", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await expect(page).toHaveURL(/\/cv-builder/);
  await expect(builder.heading()).toBeVisible();
});

Then("I see CV {string} in my list", async ({ page }, title: string) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.cvLink(title)).toBeVisible();
});

Then("I see the empty CV list", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.emptyState()).toBeVisible();
});
