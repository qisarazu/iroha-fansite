import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditCommitParams,
  GridColDef,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import type { SingingStream, Song, Video } from '@prisma/client';
import withAuthRequired from '@supabase/supabase-auth-helpers/nextjs/utils/withAuthRequired';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { MdDelete } from 'react-icons/md';

import {
  EditSingingStreamModal,
  Sing,
} from '../../components/features/admin/EditSingingStreamModal/EditSingingStreamModal';
import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { useDeleteSingingStreamApi } from '../../hooks/api/singing-streams/useDeleteSingingStreamApi';
import { useGetSingingStreamsApi } from '../../hooks/api/singing-streams/useGetSingingStreamsApi';
import { usePostSingingStreamApi } from '../../hooks/api/singing-streams/usePostSingingStreamApi';
import { usePutSingingStreamApi } from '../../hooks/api/singing-streams/usePutSingingStreamApi';
import { theme } from '../../styles/theme';

export const getServerSideProps = withAuthRequired({ redirectTo: '/' });

const AdminVideosPage = () => {
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

  const { data: singingStreams, mutate } = useGetSingingStreamsApi({ request: { orderBy, orderDirection } });
  const { api: postApi } = usePostSingingStreamApi({ mutate });
  const { api: putApi } = usePutSingingStreamApi({ mutate });
  const { api: deleteApi } = useDeleteSingingStreamApi({ mutate });

  const onSave = useCallback(
    ({ video, sings }: { video: Video; sings: Sing[] }) => {
      Promise.all(
        sings.map((sing) => {
          if (!sing.song) return;
          postApi({
            videoId: video.id,
            songId: sing.song.id,
            start: sing.startSec,
            end: sing.endSec,
          });
        }),
      );
    },
    [postApi],
  );

  const onChange = useCallback(
    ({ id, field, value }: GridCellEditCommitParams) => {
      if (!id || typeof id !== 'string') return;

      putApi({
        id,
        [field]: parseInt(value, 10),
      });
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

  const onModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const rows = useMemo<GridRowsProp>(
    () =>
      singingStreams.map((stream) => ({
        id: stream.id,
        song: `${stream.song.title} / ${stream.song.artist}`,
        video: stream.video.title,
        start: stream.start,
        end: stream.end,
        createdAt: format(new Date(stream.createdAt), 'yyyy/MM/dd HH:mm:ss'),
        updatedAt: format(new Date(stream.updatedAt), 'yyyy/MM/dd HH:mm:ss'),
      })),
    [singingStreams],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'song', headerName: '曲', flex: 1 },
      { field: 'video', headerName: '動画', flex: 2 },
      { field: 'start', headerName: '開始時間', editable: true, type: 'number' },
      { field: 'end', headerName: '終了時間', editable: true, type: 'number' },
      { field: 'createdAt', headerName: '作成日時', width: 160 },
      { field: 'updatedAt', headerName: '更新日時', width: 160 },
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
    <Layout title="singingStreams">
      <h1>singing streams</h1>
      <LinkList />
      <Button variant="contained" sx={{ my: 1 }} onClick={onModalOpen}>
        Add
      </Button>
      <Box sx={{ my: 1, height: theme.spacing(100) }}>
        <DataGrid rows={rows} columns={columns} onCellEditCommit={onChange} />
      </Box>
      <EditSingingStreamModal open={isModalOpen} onSave={onSave} onClose={onModalClose} />
    </Layout>
  );
};

export default AdminVideosPage;
