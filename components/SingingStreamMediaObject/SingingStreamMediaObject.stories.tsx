import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import { SingingStreamMediaObject } from './SingingStreamMediaObject';

export default {
  title: 'components/SingingStreamMediaObject',
  component: SingingStreamMediaObject
} as ComponentMeta<typeof SingingStreamMediaObject>;

const Template: ComponentStory<typeof SingingStreamMediaObject> = (args) => (
  <SingingStreamMediaObject {...args} />
);

export const Default = Template.bind({});
Default.args = {
  singingStream: {
    id: 'fca89a73-8f7f-41f1-8343-6b898dffc960',
    video_id: 'v-bCLl7zR00',
    song_title: '群青',
    song_artist: 'YOASOBI',
    video: {
      title: '【歌枠】良いお知らせ✨週1歌枠🎤【風真いろは/ホロライブ】',
      url: 'https://www.youtube.com/watch?v=v-bCLl7zR00',
      published_at: '2022-01-23T17:47:15+00:00'
    }
  }
};
