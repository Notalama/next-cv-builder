import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';

import { cvTemplate } from '@/app/cv-builder/template/cv-template';
import type { CvFormValues } from '@/app/cv-builder/schema';

import CvBuilderPreview from './preview';

const emptyCv: CvFormValues = {
  fullName: '',
  role: '',
  photo: '',
  email: '',
  phone: '',
  location: '',
  links: '',
  languages: [{ name: '', level: '' }],
  primarySkills: '',
  secondarySkills: '',
  domains: '',
  aboutMe: '',
  techPrinciples: '',
  projects: [
    {
      companyName: '',
      period: '',
      position: '',
      description: '',
      technologies: '',
      domain: '',
    },
  ],
};

const meta = {
  component: CvBuilderPreview,
  tags: ['ai-generated'],
  args: {
    data: cvTemplate,
  },
} satisfies Meta<typeof CvBuilderPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTemplateData: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: cvTemplate.fullName, level: 1 }),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: {
    data: emptyCv,
  },
};

export const CssCheck: Story = {
  args: {
    data: cvTemplate,
  },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', {
      name: cvTemplate.fullName,
      level: 1,
    });
    // CvBuilderPreview h1 uses text-slate-900 — fails if Tailwind did not load.
    await expect(getComputedStyle(heading).color).toBe(
      'oklch(0.208 0.042 265.755)',
    );
  },
};
