import { Button } from '@mantine/core';
import type { Playlist } from '@prisma/client';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import { EditPlaylistModal } from './EditPlaylistModal';
import { useEditPlaylistModal } from './useEditPlaylistModal';

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
