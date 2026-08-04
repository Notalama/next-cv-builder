import { expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";
import { SpriteGeneratorPage } from "../pages/sprite-generator.page";
import { Then, When } from "../support/fixtures";

When("I open the sprite sheet generator", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.openSpriteGenerator();
});

When("I visit the sprite sheet generator", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await sprite.goto();
});

When(
  "I upload sprite frames {string} and {string}",
  async ({ page }, first: string, second: string) => {
    const sprite = new SpriteGeneratorPage(page);
    await sprite.uploadFrames(first, second);
  },
);

When("I create the sprite sheet", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await sprite.createSprite();
});

Then("I am on the sprite sheet generator page", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await expect(page).toHaveURL(/\/sprite-generator/);
  await expect(sprite.heading()).toBeVisible();
});

Then("I see a back to dashboard control", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await expect(sprite.backToDashboard()).toBeVisible();
});

Then("I see {int} uploaded sprite frames", async ({ page }, count: number) => {
  const sprite = new SpriteGeneratorPage(page);
  await expect(sprite.uploadedFrames()).toHaveCount(count);
});

Then("the create sprite button is enabled", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await expect(sprite.createSpriteButton()).toBeEnabled();
});

Then("I see the generated sprite sheet result", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await expect(sprite.resultSection()).toBeVisible();
});

Then("I see a download sprite sheet button", async ({ page }) => {
  const sprite = new SpriteGeneratorPage(page);
  await expect(sprite.downloadButton()).toBeVisible();
});
