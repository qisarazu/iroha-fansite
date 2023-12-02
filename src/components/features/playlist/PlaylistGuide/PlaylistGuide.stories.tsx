import type { Meta, StoryFn } from '@storybook/react';

import { PlaylistGuide } from './PlaylistGuide';

export default {
  title: 'components/features/playlist/PlaylistGuide',
  component: PlaylistGuide,
} as Meta<typeof PlaylistGuide>;

const StoryTemplate: StoryFn<typeof PlaylistGuide> = () => <PlaylistGuide />;

export const Default = StoryTemplate.bind({});
Default.args = {};
