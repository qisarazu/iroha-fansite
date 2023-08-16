import { Box, Button, ThemeProvider } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  GridRowModel,
  type GridRowParams,
  type GridRowsProp,
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
import { muiTheme } from '../../styles/theme';
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
    async ({ id, artist, title }: GridRowModel<Song>) => {
      const data = await putApi({ id, artist, title });
      if (!data) throw new Error('put error');
      return data;
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

  const columns = useMemo<GridColDef[]>(() => {
    return [
      { field: 'title', headerName: '曲名', flex: 2, editable: true },
      { field: 'artist', headerName: 'アーティスト', flex: 1, editable: true },
      {
        field: 'createdAt',
        headerName: '作成日',
        width: 160,
        valueFormatter: ({ value }) => format(new Date(value), 'yyyy/MM/dd HH:mm:ss'),
      },
      {
        field: 'updatedAt',
        headerName: '更新日',
        width: 160,
        valueFormatter: ({ value }) => format(new Date(value), 'yyyy/MM/dd HH:mm:ss'),
      },
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
    <ThemeProvider theme={muiTheme}>
      <Layout title="songs">
        <h1>songs</h1>
        <LinkList />
        <Button variant="contained" onClick={onAdd}>
          Add
        </Button>
        <Box sx={{ my: muiTheme.spacing(1), height: muiTheme.spacing(100) }}>
          <DataGrid rows={songs} columns={columns} loading={isLoading} processRowUpdate={onChange} />
        </Box>
        <EditSongModal open={isModalOpen} onSave={onSave} onClose={onModalClose} />
      </Layout>
    </ThemeProvider>
  );
};

export default AdminSongsPage;
