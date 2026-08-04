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

When("I delete the CV titled {string}", async ({ page }, title: string) => {
  const dashboard = new DashboardPage(page);
  await dashboard.deleteCv(title);
});

When("I copy the CV titled {string}", async ({ page }, title: string) => {
  const dashboard = new DashboardPage(page);
  await dashboard.copyCv(title);
});

When(
  "I rename the CV titled {string} to {string}",
  async ({ page }, title: string, newTitle: string) => {
    const dashboard = new DashboardPage(page);
    await dashboard.renameCv(title, newTitle);
  },
);

When(
  "I open rename for the CV titled {string}",
  async ({ page }, title: string) => {
    const dashboard = new DashboardPage(page);
    await dashboard.openRename(title);
  },
);

When("I set the rename field to {string}", async ({ page }, value: string) => {
  const dashboard = new DashboardPage(page);
  await dashboard.setRenameField(value);
});

When("I cancel rename", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.cancelRename();
});

Then("I see a CV deleted confirmation", async ({ page }) => {
  await expect(page.getByText("CV deleted")).toBeVisible();
});

Then("I see a CV copied confirmation", async ({ page }) => {
  await expect(page.getByText("CV copied")).toBeVisible();
});

Then("I see a CV renamed confirmation", async ({ page }) => {
  await expect(page.getByText("CV renamed")).toBeVisible();
});

Then("I see CV {string} in my list", async ({ page }, title: string) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.cvLink(title)).toBeVisible();
});

Then("I do not see CV {string} in my list", async ({ page }, title: string) => {
  const dashboard = new DashboardPage(page);
  await expect(dashboard.cvLink(title)).toHaveCount(0);
});

Then("I see the empty CV list", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await expect(dashboard.emptyState()).toBeVisible();
});
