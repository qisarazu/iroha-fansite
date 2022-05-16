import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import type { Playlist, SingingStream } from '@prisma/client';
import { useCallback, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import { EditPlaylistModal } from '../../components/features/playlist/EditPlaylistModal/EditPlaylistModal';
import { PlaylistCard } from '../../components/features/playlist/PlaylistCard/PlaylistCard';
import { Layout } from '../../components/Layout/Layout';
import type { PlaylistWithItems } from '../../types/Playlist';
import { fetcher } from '../../utils/fetcher';

export default function LibraryIndexPage() {
  const { data: playlists, mutate } = useSWRImmutable<PlaylistWithItems[]>('/api/playlists', fetcher);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistWithItems | null>(null);

  const onEdit = useCallback((playlist: PlaylistWithItems) => {
    setSelectedPlaylist(playlist);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback(
    async (id: Playlist['id']) => {
      await fetch(`/api/playlists/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      mutate();
    },
    [mutate],
  );

  const onSave = useCallback(
    async ({ title, description, items }: { title: string; description?: string; items: SingingStream['id'][] }) => {
      await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          items,
        }),
      }).then((res) => res.json());

      mutate();
    },
    [mutate],
  );

  const onClose = useCallback(() => {
    setShowEditModal(false);
  }, []);

  return (
    <Layout title="ライブラリ">
      <Button onClick={() => setShowEditModal(true)}>プレイリストを作成</Button>
      {!playlists ? (
        <CircularProgress />
      ) : !playlists.length ? (
        <Typography>プレイリストはありません</Typography>
      ) : (
        <Stack direction="row" spacing={1}>
          {playlists.map((playlist) => (
            <PlaylistCard playlist={playlist} onEdit={onEdit} onDelete={handleDelete} key={playlist.id} />
          ))}
        </Stack>
      )}
      <EditPlaylistModal open={showEditModal} playlist={selectedPlaylist} onSave={onSave} onClose={onClose} />
    </Layout>
  );
}
