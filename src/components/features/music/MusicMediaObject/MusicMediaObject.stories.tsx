import type { Meta, StoryObj } from '@storybook/react';

import { MusicMediaObject } from './MusicMediaObject';

const singingStream = {
  id: '1a61e14d-fa06-4268-85b1-b319b55af8ce',
  start: 2164,
  end: 2298,
  videoId: '4b7ebbbf-a17d-4496-a573-81738d085d84',
  songId: '684efa5e-9ec3-49aa-80c1-12304a9e9c6b',
  createdAt: new Date('2023-03-20T06:27:45.624Z'),
  updatedAt: new Date('2023-03-20T06:27:45.624Z'),
  video: {
    id: '4b7ebbbf-a17d-4496-a573-81738d085d84',
    videoId: '_7WYpgjIoxM',
    title: '【歌枠】歌初め✨週1歌枠でござる🎤【風真いろは/ホロライブ】',
    duration: 4036,
    thumbnailDefaultUrl: 'https://i.ytimg.com/vi/_7WYpgjIoxM/default.jpg',
    thumbnailMediumUrl: 'https://i.ytimg.com/vi/_7WYpgjIoxM/mqdefault.jpg',
    thumbnailHighUrl: 'https://i.ytimg.com/vi/_7WYpgjIoxM/hqdefault.jpg',
    publishedAt: new Date('2022-01-01T02:11:57.000Z'),
    createdAt: new Date('2023-03-20T06:27:45.601Z'),
    updatedAt: new Date('2023-03-20T06:27:45.601Z'),
  },
  song: {
    id: '684efa5e-9ec3-49aa-80c1-12304a9e9c6b',
    title: 'KING',
    artist: 'Kanaria',
    createdAt: new Date('2023-03-20T06:27:45.611Z'),
    updatedAt: new Date('2023-03-20T06:27:45.611Z'),
  },
};

const meta: Meta<typeof MusicMediaObject> = {
  title: 'components/features/music/MusicMediaObject',
  component: MusicMediaObject,
  tags: ['autodocs'],
  args: {
    singingStream,
  },
};

export default meta;

type Story = StoryObj<typeof MusicMediaObject>;

export const Default: Story = {
  args: {
    singingStream,
  },
};
