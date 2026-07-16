import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { ClassicSidebarTemplate } from "@/app/cv-builder/_components/preview/templates";
import { cvTemplate } from "@/app/cv-builder/_template/cv-template";
import { CV_FORM_DEFAULT_VALUES } from "@/models/cv";

const meta = {
  component: ClassicSidebarTemplate,
  tags: ["ai-generated"],
  args: {
    data: cvTemplate,
  },
} satisfies Meta<typeof ClassicSidebarTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTemplateData: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { name: cvTemplate.fullName, level: 1 }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: {
    data: CV_FORM_DEFAULT_VALUES,
  },
};

export const CssCheck: Story = {
  args: {
    data: cvTemplate,
  },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", {
      name: cvTemplate.fullName,
      level: 1,
    });
    // ClassicSidebarTemplate h1 uses text-slate-900 — fails if Tailwind did not load.
    await expect(getComputedStyle(heading).color).toBe(
      "oklch(0.208 0.042 265.755)",
    );
  },
};
