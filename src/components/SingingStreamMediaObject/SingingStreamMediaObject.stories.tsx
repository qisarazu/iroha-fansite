import type { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { SingingStreamMediaObject } from './SingingStreamMediaObject';

export default {
  title: 'components/SingingStreamMediaObject',
  component: SingingStreamMediaObject,
} as ComponentMeta<typeof SingingStreamMediaObject>;

const Template: ComponentStory<typeof SingingStreamMediaObject> = (args) => <SingingStreamMediaObject {...args} />;

export const Default = Template.bind({});
Default.args = {
  singingStream: {
    id: '020d33e7-4355-4a5b-b1ef-7e232586aeb0',
    start: 2792,
    end: 2986,
    videoId: 'c07ec00a-015b-4be3-99d6-e7b55d0d4c2b',
    songId: 'cd34565b-ba84-4965-a852-957f13dd2742',
    createdAt: new Date('2022-04-29T16:06:20.302Z'),
    updatedAt: new Date('2022-04-29T16:06:20.302Z'),
    video: {
      id: 'c07ec00a-015b-4be3-99d6-e7b55d0d4c2b',
      videoId: 'ZJAfpnYEMxM',
      title: '【歌枠】週1歌枠🎤初ボイトレ後の歌枠！！【風真いろは/ホロライブ】',
      duration: 3916,
      thumbnailDefaultUrl: 'https://i.ytimg.com/vi/ZJAfpnYEMxM/default.jpg',
      thumbnailMediumUrl: 'https://i.ytimg.com/vi/ZJAfpnYEMxM/mqdefault.jpg',
      thumbnailHighUrl: 'https://i.ytimg.com/vi/ZJAfpnYEMxM/hqdefault.jpg',
      publishedAt: new Date('2022-02-04T15:14:18.000Z'),
      createdAt: new Date('2022-04-21T16:39:51.633Z'),
      updatedAt: new Date('2022-04-21T16:39:53.521Z'),
    },
    song: {
      id: 'cd34565b-ba84-4965-a852-957f13dd2742',
      title: 'フォニイ',
      artist: 'ツミキ',
      createdAt: new Date('2022-04-21T16:48:33.065Z'),
      updatedAt: new Date('2022-04-21T16:49:11.386Z'),
    },
  },
};
