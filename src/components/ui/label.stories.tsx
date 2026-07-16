import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  component: Label,
  tags: ["ai-generated"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-[320px] gap-2">
      <Label {...args} />
      <Input id="email" type="email" placeholder="john.doe@example.com" />
    </div>
  ),
  args: {
    htmlFor: "email",
    children: "Email address",
  },
};

export const WithRequiredMarker: Story = {
  render: (args) => (
    <Label {...args}>
      Phone number <span className="text-destructive">*</span>
    </Label>
  ),
  args: {
    htmlFor: "phone",
  },
};
