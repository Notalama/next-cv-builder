import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Textarea } from './textarea';
import { Label } from './label';

const meta = {
  component: Textarea,
  tags: ['ai-generated'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="about-me">About me</Label>
      <Textarea id="about-me" {...args} />
    </div>
  ),
  args: {
    placeholder: 'Brief overview of your experience and focus areas.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('About me')).toHaveAttribute(
      'placeholder',
      'Brief overview of your experience and focus areas.',
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This field cannot be edited.',
  },
};
