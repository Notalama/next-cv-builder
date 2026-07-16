import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";

const meta = {
  component: Separator,
  tags: ["ai-generated"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[320px] space-y-2">
      <p className="text-sm">Primary skills</p>
      <Separator />
      <p className="text-sm text-muted-foreground">
        React, TypeScript, Next.js
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-4">
      <span className="text-sm">Form</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Preview</span>
    </div>
  ),
};
