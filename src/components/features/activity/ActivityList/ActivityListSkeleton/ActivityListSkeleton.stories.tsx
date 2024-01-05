import type { Meta, StoryFn } from '@storybook/react';

import { ActivityListSkeleton } from './ActivityListSkeleton';

export default {
  title: 'components/features/activity/ActivityListSkeleton',
  component: ActivityListSkeleton,
} as Meta<typeof ActivityListSkeleton>;

const StoryTemplate: StoryFn<typeof ActivityListSkeleton> = (args) => <ActivityListSkeleton {...args} />;

export const Default = StoryTemplate.bind({});
Default.args = {
  // TODO
};
