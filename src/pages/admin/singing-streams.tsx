import { Button, CircularProgress } from '@mui/material';
import type { SingingStream, Song, Video } from '@prisma/client';
import withAuthRequired from '@supabase/supabase-auth-helpers/nextjs/utils/withAuthRequired';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';

import { EditSingingStreamModal } from '../../components/features/admin/EditSingingStreamModal/EditSingingStreamModal';
import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { ButtonCell } from '../../components/Table/ButtonCell/ButtonCell';
import { EditableCell } from '../../components/Table/EditableCell/EditableCell';
import { Table } from '../../components/Table/Table';
import { useDeleteSingingStreamApi } from '../../hooks/api/singing-streams/useDeleteSingingStreamApi';
import { useGetSingingStreamsApi } from '../../hooks/api/singing-streams/useGetSingingStreamsApi';
import { usePostSingingStreamApi } from '../../hooks/api/singing-streams/usePostSingingStreamApi';
import { usePutSingingStreamApi } from '../../hooks/api/singing-streams/usePutSingingStreamApi';

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
    ({ video, song }: { video: Video; song: Song }) => {
      postApi({
        start: 0,
        end: 0,
        videoId: video.id,
        songId: song.id,
      });
    },
    [postApi],
  );

  const onSortChange = useCallback(
    (key: string, direction: 'asc' | 'desc') => {
      if (key === 'delete') return;
      router.replace({
        query: {
          orderBy: key,
          orderDirection: direction,
        },
      });
    },
    [router],
  );

  const onChange = useCallback(
    (rowIndex: number, columnId: string, value: string | number) => {
      const singingStream = singingStreams?.[rowIndex];
      if (!singingStream) return;

      putApi({
        id: singingStream.id,
        [columnId]: value,
      });
    },
    [putApi, singingStreams],
  );

  const onDelete = useCallback(
    (rowIndex: number) => {
      const singingStream = singingStreams?.[rowIndex];
      if (!singingStream) return;

      if (confirm(`[${singingStream.id}]\n削除しますか?`)) {
        deleteApi({ id: singingStream.id });
      }
    },
    [deleteApi, singingStreams],
  );

  const onModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <Layout title="singingStreams">
      <h1>singing streams</h1>
      <LinkList />
      {!singingStreams ? (
        <CircularProgress />
      ) : (
        <div>
          <Button variant="contained" sx={{ my: 1 }} onClick={onModalOpen}>
            Add
          </Button>
          <Table
            data={singingStreams}
            headers={['video', 'song', 'start', 'end', 'createdAt', 'delete']}
            defaultSort={{ key: orderBy, direction: orderDirection }}
            onSortChange={onSortChange}
          >
            {(singingStream, i) => (
              <tr key={singingStream.id}>
                <td>{singingStream.video.title}</td>
                <td>{singingStream.song.title}</td>
                <EditableCell columnId="start" rowIndex={i} value={singingStream.start} onChange={onChange} />
                <EditableCell columnId="end" rowIndex={i} value={singingStream.end} onChange={onChange} />
                <td>{format(new Date(singingStream.createdAt), 'yyyy/MM/dd HH:mm')}</td>
                <ButtonCell columnId="delete" rowIndex={i} variant="secondary" label="delete" onClick={onDelete} />
              </tr>
            )}
          </Table>
        </div>
      )}
      <EditSingingStreamModal open={isModalOpen} onSave={onSave} onClose={onModalClose} />
    </Layout>
  );
};

export default AdminVideosPage;
