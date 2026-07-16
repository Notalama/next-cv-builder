import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  component: Input,
  tags: ["ai-generated"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="full-name">Full name</Label>
      <Input id="full-name" {...args} />
    </div>
  ),
  args: {
    placeholder: "John Doe",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Full name")).toHaveAttribute(
      "placeholder",
      "John Doe",
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Read only value",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    placeholder: "Invalid email",
  },
};
