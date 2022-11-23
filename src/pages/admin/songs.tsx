import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditCommitParams,
  GridColDef,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import type { Song } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import { EditSongModal } from '../../components/features/admin/EditSongModal/EditSongModal';
import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { useDeleteSongApi } from '../../hooks/api/songs/useDeleteSongApi';
import { useGetSongsApi } from '../../hooks/api/songs/useGetSongsApi';
import { usePostSongApi } from '../../hooks/api/songs/usePostSongApi';
import { usePutSongApi } from '../../hooks/api/songs/usePutSongApi';
import { theme } from '../../styles/theme';
import { asAdminRequirePage } from '../../utils/asAdminRequirePage';

export const getServerSideProps = asAdminRequirePage;

const AdminSongsPage = () => {
  const router = useRouter();

  const orderBy = useMemo(() => {
    const { orderBy } = router.query;
    return (orderBy as keyof Song) || 'createdAt';
  }, [router]);

  const orderDirection = useMemo(() => {
    const { orderDirection } = router.query;
    return (orderDirection as 'asc' | 'desc') || 'desc';
  }, [router]);

  const { data: songs, isLoading, mutate } = useGetSongsApi({ request: { orderBy, orderDirection } });
  const { api: postApi } = usePostSongApi({ mutate });
  const { api: putApi } = usePutSongApi({ mutate });
  const { api: deleteApi } = useDeleteSongApi({ mutate });

  const [isModalOpen, setModalOpen] = useState(false);

  const onAdd = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const onChange = useCallback(
    ({ id, field, value }: GridCellEditCommitParams) => {
      if (!id || typeof id !== 'string') return;

      putApi({
        id,
        [field]: value,
      });
    },
    [putApi],
  );

  const onDelete = useCallback(
    (song: Song) => () => {
      if (confirm(`[${song.id}]\n${song.title} / ${song.artist}\nこの曲を削除しますか?`)) {
        deleteApi({ id: song.id });
      }
    },
    [deleteApi],
  );

  const onSave = useCallback(
    async (song: Pick<Song, 'title' | 'artist'>) => {
      await postApi(song);
      onModalClose();
    },
    [onModalClose, postApi],
  );

  const rows = useMemo<GridRowsProp>(() => {
    return songs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      createdAt: format(new Date(song.createdAt), 'yyyy/MM/dd HH:mm:ss'),
      updatedAt: format(new Date(song.updatedAt), 'yyyy/MM/dd HH:mm:ss'),
    }));
  }, [songs]);

  const columns = useMemo<GridColDef[]>(() => {
    return [
      { field: 'title', headerName: '曲名', flex: 2, editable: true },
      { field: 'artist', headerName: 'アーティスト', flex: 1, editable: true },
      { field: 'createdAt', headerName: '作成日', width: 160 },
      { field: 'updatedAt', headerName: '更新日', width: 160 },
      {
        field: 'actions',
        type: 'actions',
        headerName: '削除',
        getActions: ({ row }: GridRowParams) => {
          return [<GridActionsCellItem key="delete" icon={<MdDelete />} label="削除" onClick={onDelete(row)} />];
        },
      },
    ];
  }, [onDelete]);

  return (
    <Layout title="songs">
      <h1>songs</h1>
      <LinkList />
      <Button variant="contained" onClick={onAdd}>
        Add
      </Button>
      <Box sx={{ my: theme.spacing(1), height: theme.spacing(100) }}>
        <DataGrid rows={rows} columns={columns} loading={isLoading} onCellEditCommit={onChange} />
      </Box>
      <EditSongModal open={isModalOpen} onSave={onSave} onClose={onModalClose} />
    </Layout>
  );
};

export default AdminSongsPage;
