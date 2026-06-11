import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { Button } from './button';

const meta = {
  component: Button,
  tags: ['ai-generated'],
  args: {
    children: 'Submit',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /submit/i })).toHaveTextContent(
      'Submit',
    );
  },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Save draft' },
};
