import type { Song } from '@prisma/client';
import withAuthRequired from '@supabase/supabase-auth-helpers/nextjs/utils/withAuthRequired';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { Button } from '../../components/Button/Button';
import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { Spinner } from '../../components/Spinner/Spinner';
import { ButtonCell } from '../../components/Table/ButtonCell/ButtonCell';
import { EditableCell } from '../../components/Table/EditableCell/EditableCell';
import { Table } from '../../components/Table/Table';
import { useDeleteSongApi } from '../../hooks/api/songs/useDeleteSongApi';
import { useGetSongsApi } from '../../hooks/api/songs/useGetSongsApi';
import { usePostSongApi } from '../../hooks/api/songs/usePostSongApi';
import { usePutSongApi } from '../../hooks/api/songs/usePutSongApi';

export const getServerSideProps = withAuthRequired({ redirectTo: '/' });

const AdminVideosPage = () => {
  const router = useRouter();

  const orderBy = useMemo(() => {
    const { orderBy } = router.query;
    return (orderBy as keyof Song) || 'createdAt';
  }, [router]);

  const orderDirection = useMemo(() => {
    const { orderDirection } = router.query;
    return (orderDirection as 'asc' | 'desc') || 'desc';
  }, [router]);

  const { data: songs, mutate } = useGetSongsApi({ request: { orderBy, orderDirection } });
  const { api: postApi } = usePostSongApi({ mutate });
  const { api: putApi } = usePutSongApi({ mutate });
  const { api: deleteApi } = useDeleteSongApi({ mutate });

  const onAdd = useCallback(() => {
    postApi({
      title: '',
      artist: '',
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
      const song = songs?.[rowIndex];
      if (!song) return;

      putApi({
        id: song.id,
        [columnId]: value,
      });
    },
    [putApi, songs],
  );

  const onDelete = useCallback(
    (rowIndex: number) => {
      const song = songs?.[rowIndex];
      if (!song) return;

      if (confirm(`[${song.id}]\n${song.title} / ${song.artist}\nこの曲を削除しますか?`)) {
        deleteApi({ id: song.id });
      }
    },
    [deleteApi, songs],
  );

  return (
    <Layout title="songs">
      <h1>songs</h1>
      <LinkList />
      {!songs ? (
        <Spinner />
      ) : (
        <div>
          <Button onClick={onAdd}>Add Row</Button>
          <Table
            data={songs}
            headers={['title', 'artist', 'createdAt', 'delete']}
            defaultSort={{ key: orderBy, direction: orderDirection }}
            onSortChange={onSortChange}
          >
            {(song, i) => (
              <tr key={song.id}>
                <EditableCell columnId="title" rowIndex={i} value={song.title} onChange={onChange} />
                <EditableCell columnId="artist" rowIndex={i} value={song.artist} onChange={onChange} />
                <td>{format(new Date(song.createdAt), 'yyyy/MM/dd HH:mm')}</td>
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
