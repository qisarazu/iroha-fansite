import type { Meta, StoryObj } from '@storybook/react';

import { MusicLength } from './MusicLength';

const meta: Meta<typeof MusicLength> = {
  title: 'components/base/display/MusicLength',
  component: MusicLength,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MusicLength>;

export const Default: Story = {
  args: {
    start: 2164,
    end: 2298,
  },
};
