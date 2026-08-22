import { expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";
import { SpeedReaderPage } from "../pages/speed-reader.page";
import { Then, When } from "../support/fixtures";

When("I open the speed reader", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.openSpeedReader();
});

Then("I am on the speed reader page", async ({ page }) => {
  const speedReader = new SpeedReaderPage(page);
  await expect(page).toHaveURL(/\/cv-builder\/speed-reader/);
  await expect(speedReader.heading()).toBeVisible();
});

Then("I see the speed reader tool", async ({ page }) => {
  const speedReader = new SpeedReaderPage(page);
  await expect(speedReader.textInput()).toBeVisible();
  await expect(speedReader.playButton()).toBeVisible();
});
