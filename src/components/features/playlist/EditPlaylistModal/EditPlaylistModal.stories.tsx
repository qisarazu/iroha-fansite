import { Button } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import type { Playlist } from '../../../../services/playlists/type';
import { EditPlaylistModal } from './EditPlaylistModal';
import { useEditPlaylistModal } from './useEditPlaylistModal';

const playlist: Playlist = {
  id: '4g2eoN6REWaw',
  title: 'title',
  description: 'description',
  thumbnailURLs: [],
  items: [],
};

export default {
  title: 'components/features/playlist/EditPlaylistModal',
  component: EditPlaylistModal,
  decorators: [
    () => {
      const { open } = useEditPlaylistModal();
      useEffect(() => {
        open(playlist);
      }, [open]);
      return <Button onClick={() => open(playlist)}>OPEN</Button>;
    },
  ],
} satisfies Meta<typeof EditPlaylistModal>;

type Story = StoryObj<typeof EditPlaylistModal>;

export const Default: Story = {};
