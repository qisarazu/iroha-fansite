import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { SingingStreamMediaObject } from './SingingStreamMediaObject';

export default {
  title: 'components/SingingStreamMediaObject',
  component: SingingStreamMediaObject,
} as ComponentMeta<typeof SingingStreamMediaObject>;

const Template: ComponentStory<typeof SingingStreamMediaObject> = (args) => <SingingStreamMediaObject {...args} />;

export const Default = Template.bind({});
Default.args = {
  singingStream: {
    id: '153537dc-870a-4fce-a1e8-4f0f0f771c18',
    start: 1117,
    video_id: '-LTfdOjVRMM',
    published_at: '2021-12-02T15:24:29+00:00',
    video: {
      title: '【歌枠】緊張！初歌枠でござる！🎵【風真いろは/ホロライブ6期生】',
      url: 'https://www.youtube.com/watch?v=-LTfdOjVRMM',
    },
    song: {
      title: 'おじゃま虫',
      artist: 'DECO*27',
    },
  },
};
