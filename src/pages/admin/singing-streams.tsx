import { Box, Button, ThemeProvider } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowModel,
  type GridRowParams,
  type GridRowsProp,
} from '@mui/x-data-grid';
import type { SingingStream, Video } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import {
  EditSingingStreamModal,
  type Sing,
} from '../../components/features/admin/EditSingingStreamModal/EditSingingStreamModal';
import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { useDeleteSingingStreamApi } from '../../hooks/api/singing-streams/useDeleteSingingStreamApi';
import { useGetSingingStreamsApi } from '../../hooks/api/singing-streams/useGetSingingStreamsApi';
import { usePostSingingStreamApi } from '../../hooks/api/singing-streams/usePostSingingStreamApi';
import { usePutSingingStreamApi } from '../../hooks/api/singing-streams/usePutSingingStreamApi';
import { muiTheme } from '../../styles/theme';
import type { SingingStreamWithVideoAndSong } from '../../types/SingingStream';
import { asAdminRequirePage } from '../../utils/asAdminRequirePage';

export const getServerSideProps = asAdminRequirePage;

const AdminSingingStreamsPage = () => {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState(false);

  const orderBy = useMemo(() => {
    const { orderBy } = router.query;
    return (orderBy as keyof SingingStream) || 'createdAt';
  }, [router]);

  const orderDirection = useMemo(() => {
    const { orderDirection } = router.query;
    return (orderDirection as 'asc' | 'desc') || 'desc';
  }, [router]);

  const { data: singingStreams, mutate } = useGetSingingStreamsApi({
    request: { orderBy, orderDirection, all: true },
  });
  const { api: postApi } = usePostSingingStreamApi({ mutate });
  const { api: putApi } = usePutSingingStreamApi({ mutate });
  const { api: deleteApi } = useDeleteSingingStreamApi({ mutate });

  const onModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const onSave = useCallback(
    async ({ video, sings }: { video: Video; sings: Sing[] }) => {
      await Promise.all(
        sings.map((sing) => {
          if (!sing.song) return;
          return postApi({
            videoId: video.id,
            songId: sing.song.id,
            start: sing.startSec,
            end: sing.endSec,
          });
        }),
      );
      onModalClose();
    },
    [onModalClose, postApi],
  );

  const onChange = useCallback(
    async ({ id, start, end }: GridRowModel<SingingStreamWithVideoAndSong>) => {
      const res = await putApi({ id, start, end });
      if (!res) throw new Error('put error');

      return res;
    },
    [putApi],
  );

  const onDelete = useCallback(
    (singingStream: SingingStream) => () => {
      if (confirm(`[${singingStream.id}]\n削除しますか?`)) {
        deleteApi({ id: singingStream.id });
      }
    },
    [deleteApi],
  );

  const rows = useMemo<GridRowsProp<SingingStreamWithVideoAndSong>>(() => singingStreams || [], [singingStreams]);

  const columns = useMemo<GridColDef<SingingStreamWithVideoAndSong>[]>(
    () => [
      { field: 'song', headerName: '曲', flex: 1, valueFormatter: ({ value }) => `${value.title} / ${value.artist}` },
      { field: 'video', headerName: '動画', flex: 2, valueFormatter: ({ value }) => value.title },
      { field: 'start', headerName: '開始時間', editable: true, type: 'number' },
      { field: 'end', headerName: '終了時間', editable: true, type: 'number' },
      {
        field: 'createdAt',
        headerName: '作成日時',
        width: 160,
        valueFormatter: ({ value }) => format(new Date(value), 'yyyy/MM/dd HH:mm:ss'),
      },
      {
        field: 'updatedAt',
        headerName: '更新日時',
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
    ],
    [onDelete],
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Layout title="singingStreams">
        <h1>singing streams</h1>
        <LinkList />
        <Button variant="contained" sx={{ my: 1 }} onClick={onModalOpen}>
          Add
        </Button>
        <Box sx={{ my: 1, height: muiTheme.spacing(100) }}>
          <DataGrid rows={rows} columns={columns} processRowUpdate={onChange} />
        </Box>
        <EditSingingStreamModal open={isModalOpen} onSave={onSave} onClose={onModalClose} />
      </Layout>
    </ThemeProvider>
  );
};

export default AdminSingingStreamsPage;
