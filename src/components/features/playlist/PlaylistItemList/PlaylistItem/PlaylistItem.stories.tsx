import type { Meta, StoryObj } from '@storybook/react';

import type { PlaylistItemWithMusic } from '../../../../../services/playlists/type';
import { PlaylistItem } from './PlaylistItem';

const playlistItem: PlaylistItemWithMusic = {
  id: 'tszWlBaOMvRB',
  position: 1,
  playlistId: 'FJPgKN6F2JK7',
  musicId: '2e9bac2b-61b8-4b9a-8218-a9620879b7df',
  createdAt: new Date('2023-05-03T05:17:36.522Z'),
  updatedAt: new Date('2023-05-03T05:17:36.522Z'),
  music: {
    id: '2e9bac2b-61b8-4b9a-8218-a9620879b7df',
    start: 2294,
    end: 2546,
    videoId: '253ddccc-a820-478a-93f4-0d7557b7d8f4',
    songId: 'cf534367-4e20-468a-a0b7-e428ff75fd5a',
    createdAt: new Date('2023-05-02T04:25:55.709Z'),
    updatedAt: new Date('2023-05-02T04:25:55.709Z'),
    song: {
      id: 'cf534367-4e20-468a-a0b7-e428ff75fd5a',
      title: 'again',
      artist: 'YUI',
      createdAt: new Date('2023-05-02T04:25:55.697Z'),
      updatedAt: new Date('2023-05-02T04:25:55.697Z'),
    },
    video: {
      id: '253ddccc-a820-478a-93f4-0d7557b7d8f4',
      videoId: 'CxZ1Kduyx1M',
      title: '【歌枠】週1歌枠🎵がんばって練習してきましたでござる🔥【風真いろは/ホロライブ6期生】',
      duration: 3669,
      thumbnailDefaultUrl: 'https://i.ytimg.com/vi/CxZ1Kduyx1M/default.jpg',
      thumbnailMediumUrl: 'https://i.ytimg.com/vi/CxZ1Kduyx1M/mqdefault.jpg',
      thumbnailHighUrl: 'https://i.ytimg.com/vi/CxZ1Kduyx1M/hqdefault.jpg',
      publishedAt: new Date('2021-12-10T04:09:49.000Z'),
      createdAt: new Date('2023-05-02T04:25:55.686Z'),
      updatedAt: new Date('2023-05-02T04:25:55.686Z'),
    },
  },
};

export default {
  title: 'components/features/playlist/PlaylistItem',
  component: PlaylistItem,
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    item: playlistItem,
  },
} satisfies Meta<typeof PlaylistItem>;

type Story = StoryObj<typeof PlaylistItem>;

export const Default: Story = {};

export const MaxLength: Story = {
  args: {
    item: {
      ...playlistItem,
      music: {
        ...playlistItem.music,
        song: {
          ...playlistItem.music.song,
          title:
            'とても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキスト',
          artist:
            'とても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキスト',
        },
        video: {
          ...playlistItem.music.video,
          title:
            'とても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキストとても長いテキスト',
        },
      },
    },
  },
};
