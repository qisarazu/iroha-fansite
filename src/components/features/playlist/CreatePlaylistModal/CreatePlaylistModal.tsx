import { modals } from '@mantine/modals';

import { useCreatePlaylist } from '../../../../services/playlists/client';
import type { Playlist } from '../../../../services/playlists/type';
import { PlaylistForm } from '../PlaylistForm/PlaylistForm';

type FormValue = {
  title: Playlist['title'];
  description?: Playlist['description'];
};

export function CreatePlaylistModal() {
  const { createPlaylist } = useCreatePlaylist();

  function handleSubmit(data: FormValue) {
    createPlaylist({ title: data.title, description: data.description ?? null });
    handleClose();
  }

  function handleClose() {
    modals.closeAll();
  }

  return <PlaylistForm mode="create" onSubmit={handleSubmit} />;
}
