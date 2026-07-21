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

When(
  "I switch the preview template to {string}",
  async ({ page }, label: string) => {
    const builder = new CvBuilderPage(page);
    await builder.selectTemplate(label);
  },
);

When("I scroll to bottom of form", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await builder.scrollFormToBottom();
});

When("I scroll to top of form", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await builder.scrollFormToTop();
});

When("I click scroll to top button", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await builder.clickScrollToTop();
});

When("I click scroll to bottom button", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await builder.clickScrollToBottom();
});

Then(
  "I see full name {string} in the preview",
  async ({ page }, name: string) => {
    await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();
  },
);

Then("I see a CV saved confirmation", async ({ page }) => {
  await expect(page.getByText("CV saved")).toBeVisible();
});

Then("I see a scroll to top button", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await expect(builder.scrollToTopButton()).toBeVisible();
});

Then("I see a scroll to bottom button", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  await expect(builder.scrollToBottomButton()).toBeVisible();
});

Then("I see header", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  const heading = builder.heading();
  await expect(heading).toBeVisible();
  await expect
    .poll(async () => {
      return heading.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.top < window.innerHeight;
      });
    })
    .toBe(true);
});

Then("I see the save CV button", async ({ page }) => {
  const builder = new CvBuilderPage(page);
  const saveButton = builder.saveButton();
  await expect(saveButton).toBeVisible();
  await expect
    .poll(async () => {
      return saveButton.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
    })
    .toBe(true);
});
