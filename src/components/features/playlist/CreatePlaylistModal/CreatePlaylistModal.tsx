import { modals } from '@mantine/modals';
import type { Playlist } from '@prisma/client';

import { useCreatePlaylist } from '../../../../services/playlists/client';
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
