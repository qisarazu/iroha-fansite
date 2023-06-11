import { Button } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';

import { CreatePlaylistModal } from './CreatePlaylistModal';
import { useCreatePlaylistModal } from './useCreatePlaylistModal';

export default {
  title: 'components/features/playlist/CreatePlaylistModal',
  component: CreatePlaylistModal,
  decorators: [
    () => {
      const { open } = useCreatePlaylistModal();
      useEffect(() => {
        open();
      }, [open]);
      return <Button onClick={open}>OPEN</Button>;
    },
  ],
} satisfies Meta<typeof CreatePlaylistModal>;

type Story = StoryObj<typeof CreatePlaylistModal>;

export const Default: Story = {};
