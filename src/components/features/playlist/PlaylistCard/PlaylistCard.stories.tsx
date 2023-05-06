import type { Playlist } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';

import { PlaylistCard } from './PlaylistCard';

const playlist: Playlist = {
  id: '4g2eoN6REWaw',
  title: 'title',
  description: 'description',
  thumbnailURLs: [],
  ownerId: 'bb6f471f-57ff-48d3-8876-ef593a6cb244',
  createdAt: new Date('2023-05-02T08:16:34.200Z'),
  updatedAt: new Date('2023-05-02T08:16:34.200Z'),
};

export default {
  title: 'components/features/playlist/PlaylistCard',
  component: PlaylistCard,
  decorators: [
    (Story) => (
      <div style={{ width: 256 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    playlist,
  },
} satisfies Meta<typeof PlaylistCard>;

type Story = StoryObj<typeof PlaylistCard>;

export const Default: Story = {};

export const MaxLength: Story = {
  args: {
    playlist: {
      ...playlist,
      title: '最大タイトル最大タイトル最大タイトル最大タイトル最大タイトル最大タイトル最大タイトル最大タイトル最大',
      description:
        '最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文最大説明文',
    },
  },
};

export const Minimum: Story = {
  args: {
    playlist: {
      ...playlist,
      title: 'あ',
      description: null,
    },
  },
};
