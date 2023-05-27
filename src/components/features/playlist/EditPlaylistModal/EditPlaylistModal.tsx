import { modals } from '@mantine/modals';

import { useEditPlaylist } from '../../../../services/playlists/client';
import type { Playlist } from '../../../../services/playlists/type';
import { PlaylistForm } from '../PlaylistForm/PlaylistForm';

type Props = {
  playlist: Playlist;
};

type FormValue = {
  title: Playlist['title'];
  description?: Playlist['description'];
};

export function EditPlaylistModal({ playlist }: Props) {
  const { editPlaylist } = useEditPlaylist();

  function handleSubmit(data: FormValue) {
    editPlaylist({ id: playlist.id, title: data.title, description: data.description ?? null });
    handleClose();
  }

  function handleClose() {
    modals.closeAll();
  }

  return (
    <PlaylistForm
      mode="edit"
      initialValues={{ title: playlist.title, description: playlist.description }}
      onSubmit={handleSubmit}
    />
  );
}
