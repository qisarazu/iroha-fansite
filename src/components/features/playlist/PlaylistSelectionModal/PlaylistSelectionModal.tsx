import { Button, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import type { Playlist, SingingStream } from '@prisma/client';

import { useAddPlaylistItem, usePlaylists } from '../../../../services/playlists/client';
import { PlaylistThumbnail } from '../PlaylistCard/PlaylistThumbnail/PlaylistThumbnail';

type Props = {
  itemId: SingingStream['id'];
};

export function PlaylistSelectionModal({ itemId }: Props) {
  const { playlists } = usePlaylists();
  const { addPlaylistItem } = useAddPlaylistItem();

  function handleAdd(id: Playlist['id']) {
    return () => {
      addPlaylistItem({ playlistId: id, musicId: itemId });
      handleClose();
    };
  }

  function handleClose() {
    modals.closeAll();
  }

  return (
    <Stack spacing={0}>
      {playlists?.map((playlist) => (
        <Button
          sx={{
            display: 'flex',
            justifyItems: 'flex-start',
            backgroundColor: 'transparent',
            height: 'auto',
          }}
          py={8}
          key={playlist.id}
          radius="sm"
          onClick={handleAdd(playlist.id)}
        >
          <PlaylistThumbnail thumbnailURLs={playlist.thumbnailURLs} alt={playlist.title} width={64} height={36} />
          <Text fw="bold" sx={{ marginLeft: 16 }}>
            {playlist.title}
          </Text>
        </Button>
      ))}
    </Stack>
  );
}
