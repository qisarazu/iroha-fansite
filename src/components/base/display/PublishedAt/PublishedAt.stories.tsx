import type { Meta, StoryObj } from '@storybook/react';

import { PublishedAt } from './PublishedAt';

const meta: Meta<typeof PublishedAt> = {
  title: 'components/base/display/PublishedAt',
  component: PublishedAt,
  args: {
    publishedAt: new Date('2021/06/18 05:36'),
  },
};

export default meta;

type Story = StoryObj<typeof PublishedAt>;

export const Default: Story = {};

export const Bold: Story = {
  args: {
    fw: 'bold',
  },
};
