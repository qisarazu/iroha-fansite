import type { SingingStream } from '@prisma/client';
import withAuthRequired from '@supabase/supabase-auth-helpers/nextjs/utils/withAuthRequired';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { Button } from '../../components/Button/Button';
import { Layout } from '../../components/Layout/Layout';
import { Spinner } from '../../components/Spinner/Spinner';
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

  const onAdd = useCallback(() => {
    postApi({
      start: 0,
      end: 0,
      videoId: '',
      songId: '',
    });
  }, [postApi]);

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

  return (
    <Layout title="singingStreams">
      <h1>singing streams</h1>
      {!singingStreams ? (
        <Spinner />
      ) : (
        <div>
          <Button onClick={onAdd}>Add Row</Button>
          <Table
            data={singingStreams}
            headers={['start', 'end', 'createdAt', 'delete']}
            defaultSort={{ key: orderBy, direction: orderDirection }}
            onSortChange={onSortChange}
          >
            {(singingStream, i) => (
              <tr key={singingStream.id}>
                <EditableCell columnId="start" rowIndex={i} value={singingStream.start} onChange={onChange} />
                <EditableCell columnId="end" rowIndex={i} value={singingStream.end} onChange={onChange} />
                <td>{format(new Date(singingStream.createdAt), 'yyyy/MM/dd HH:mm')}</td>
                <ButtonCell columnId="delete" rowIndex={i} variant="secondary" label="delete" onClick={onDelete} />
              </tr>
            )}
          </Table>
        </div>
      )}
    </Layout>
  );
};

export default AdminVideosPage;
