import type { Meta, StoryObj } from '@storybook/react';

import type { Playlist } from '../../../../services/playlists/type';
import { PlaylistCard } from './PlaylistCard';

const playlist: Playlist = {
  id: '4g2eoN6REWaw',
  title: 'title',
  description: 'description',
  thumbnailURLs: [],
  items: [],
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
