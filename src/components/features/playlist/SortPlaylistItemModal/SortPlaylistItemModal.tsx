import { Loader } from '@mantine/core';

import { usePlaylistDetails } from '../../../../services/playlists/client';
import type { Playlist } from '../../../../services/playlists/type';
import { PlaylistItemList } from '../PlaylistItemList/PlaylistItemList';

type Props = {
  playlistId: Playlist['id'];
};

export function SortPlaylistItemModal({ playlistId }: Props) {
  const { playlist, isLoading } = usePlaylistDetails(playlistId);

  if (!playlist || isLoading) {
    return <Loader />;
  }
  return <PlaylistItemList playlistId={playlist.id} items={playlist.items} sortable />;
}
