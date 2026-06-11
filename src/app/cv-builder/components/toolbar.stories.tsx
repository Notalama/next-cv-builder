import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { CvBuilderToolbar } from './toolbar';

const meta = {
  component: CvBuilderToolbar,
  tags: ['ai-generated'],
  args: {
    onTogglePreviewOnly: fn(),
    onExportPdf: fn(),
  },
} satisfies Meta<typeof CvBuilderToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormVisible: Story = {
  args: {
    isPreviewOnly: false,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: /preview only/i }),
    ).toBeVisible();
  },
};

export const PreviewOnly: Story = {
  args: {
    isPreviewOnly: true,
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: /show form/i }));
    await expect(args.onTogglePreviewOnly).toHaveBeenCalled();
  },
};
