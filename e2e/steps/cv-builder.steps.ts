import { expect } from "@playwright/test";
import { CvBuilderPage } from "../pages/cv-builder.page";
import { Then, When } from "../support/fixtures";

When("I apply the CV preset", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await builder.applyPreset();
});

When("I save the CV", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await builder.save();
});

When("I set the full name to {string}", async ({ page }, name: string) => {
  const builder = new CvBuilderPage(page);
  await builder.fillFullName(name);
});

When("I switch the preview template to {string}", async ({ page }, label: string) => {
  const builder = new CvBuilderPage(page);
  await builder.selectTemplate(label);
});

Then("I see full name {string} in the preview", async ({ page }, name: string) => {
  await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();
});

Then("I see a CV saved confirmation", async ({ page }) => {
  await expect(page.getByText("CV saved")).toBeVisible();
});
