import { expect } from "@playwright/test";
import { Given, Then, When } from "../support/fixtures";

Given("I open the home page", async ({ page }) => {
  await page.goto("/");
});

When("I navigate to {string}", async ({ page }, path: string) => {
  await page.goto(path);
});

Then("I see heading {string}", async ({ page }, text: string) => {
  await expect(page.getByRole("heading", { name: text })).toBeVisible();
});

Then("I see text {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text, { exact: false })).toBeVisible();
});

Then("the URL contains {string}", async ({ page }, part: string) => {
  await expect(page).toHaveURL(new RegExp(part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
