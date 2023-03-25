import type { Meta, StoryObj } from '@storybook/react';

import { PublishedAt } from './PublishedAt';

const meta: Meta<typeof PublishedAt> = {
  title: 'components/base/display/PublishedAt',
  component: PublishedAt,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PublishedAt>;

const publishedAt = new Date('2021/06/18 05:36');

export const Default: Story = {
  args: {
    publishedAt,
  },
};

export const Bold: Story = {
  args: {
    publishedAt,
    weight: 'bold',
  },
};
