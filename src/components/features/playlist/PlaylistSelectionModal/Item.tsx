import { Button, Text } from '@mantine/core';
import type { Playlist, SingingStream } from '@prisma/client';

import { useAddPlaylistItem } from '../../../../services/playlists/client';
import { PlaylistThumbnail } from '../PlaylistCard/PlaylistThumbnail/PlaylistThumbnail';

type Props = {
  playlist: Playlist;
  musicId: SingingStream['id'];
  onClick: () => void;
};

export function Item({ playlist, musicId, onClick }: Props) {
  const { addPlaylistItem } = useAddPlaylistItem(playlist.id);

  function handleAdd() {
    addPlaylistItem({ playlistId: playlist.id, musicId });
    onClick();
  }

  return (
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
      onClick={handleAdd}
    >
      <PlaylistThumbnail thumbnailURLs={playlist.thumbnailURLs} alt={playlist.title} width={64} height={36} />
      <Text fw="bold" sx={{ marginLeft: 16 }}>
        {playlist.title}
      </Text>
    </Button>
  );
}
