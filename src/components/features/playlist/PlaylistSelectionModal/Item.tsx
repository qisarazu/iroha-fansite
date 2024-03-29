import { Button, Text } from '@mantine/core';
import type { SingingStream } from '@prisma/client';

import { useAddPlaylistItem } from '../../../../services/playlists/client';
import type { Playlist } from '../../../../services/playlists/type';
import { PlaylistThumbnail } from '../PlaylistCard/PlaylistThumbnail/PlaylistThumbnail';

type Props = {
  playlist: Playlist;
  musicId: SingingStream['id'];
  onClick: () => void;
};

export function Item({ playlist, musicId, onClick }: Props) {
  const { addPlaylistItem } = useAddPlaylistItem(playlist.id);

  function handleAdd() {
    addPlaylistItem({ musicId });
    onClick();
  }

  return (
    <Button
      style={{
        display: 'flex',
        justifyItems: 'flex-start',
        height: 'auto',
      }}
      color="white"
      variant="subtle"
      py={8}
      key={playlist.id}
      radius="sm"
      onClick={handleAdd}
    >
      <PlaylistThumbnail thumbnailURLs={playlist.thumbnailURLs} alt={playlist.title} width={64} height={36} />
      <Text fw="bold" style={{ marginLeft: 16 }}>
        {playlist.title}
      </Text>
    </Button>
  );
}
