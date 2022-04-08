import type { Video } from '@prisma/client';
import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs';
import { format } from 'date-fns';
import Image from 'next/image';
import { useCallback } from 'react';

import { Button } from '../../components/Button/Button';
import { Layout } from '../../components/Layout/Layout';
import { Spinner } from '../../components/Spinner/Spinner';
import { EditableCell } from '../../components/Table/EditableCell/EditableCell';
import { Table } from '../../components/Table/Table';
import { useDeleteVideoApi } from '../../hooks/api/videos/useDeleteVideoApi';
import { useGetVideosApi } from '../../hooks/api/videos/useGetVideosApi';
import { usePostVideoApi } from '../../hooks/api/videos/usePostVideoApi';
import { usePutVideoApi } from '../../hooks/api/videos/usePutVideoApi';
import { useYouTubeVideoApiFetcher } from '../../hooks/api/youtube/useGetYouTubeVideoApi';

export const getServerSideProps = withAuthRequired({ redirectTo: '/' });

const AdminVideosPage = () => {
  const { data: videos, get, mutate } = useGetVideosApi({ orderBy: 'publishedAt', orderDirection: 'desc' });
  const { post: postVideo } = usePostVideoApi();
  const { put: putVideo } = usePutVideoApi();
  const { delete: deleteVideo } = useDeleteVideoApi();
  const getYouTubeVideo = useYouTubeVideoApiFetcher();

  const onSortChange = useCallback(
    async (orderBy: string, direction: 'asc' | 'desc') => {
      const data = await get({ orderBy: orderBy as keyof Video, orderDirection: direction });
      await mutate(data, false);
    },
    [get, mutate],
  );

  const onAddRow = useCallback(async () => {
    const newVideo = await postVideo({
      videoId: '',
      title: '',
      duration: 0,
      thumbnailDefaultUrl: '',
      thumbnailMediumUrl: '',
      thumbnailHighUrl: '',
      publishedAt: new Date(),
    });
    await mutate((state) => (state ? [...state, newVideo] : [newVideo]));
  }, [mutate, postVideo]);

  const onDelete = useCallback(
    (video: Video) => async () => {
      if (confirm(`[${video.videoId}]\n${video.title}\nこの動画を削除しますか?`)) {
        const deletedVideo = await deleteVideo({ id: video.id });
        await mutate((state) => (state ? state.filter((video) => video.id !== deletedVideo.id) : []));
      }
    },
    [deleteVideo, mutate],
  );

  const onVideoIdChange = useCallback(
    async (rowIndex: number, columnId: string, value: string | number) => {
      if (!value) return;
      const videoId = typeof value === 'number' ? value.toString() : value;
      const video = await getYouTubeVideo(videoId);

      await mutate(async (state) => {
        if (!state) return state;

        const newVideo = await putVideo({
          ...state[rowIndex],
          videoId: video.id,
          title: video.title,
          duration: video.duration,
          thumbnailDefaultUrl: video.thumbnails.default,
          thumbnailMediumUrl: video.thumbnails.medium,
          thumbnailHighUrl: video.thumbnails.high,
          publishedAt: new Date(video.publishedAt),
        });
        state[rowIndex] = newVideo;
        return state;
      });
    },
    [getYouTubeVideo, mutate, putVideo],
  );

  return (
    <Layout title="videos">
      <h1>videos</h1>
      <Button onClick={onAddRow}>Add Row</Button>
      {!videos ? (
        <Spinner />
      ) : (
        <Table
          data={videos}
          headers={['videoId', 'thumbnail', 'title', 'duration', 'publishedAt', 'delete']}
          defaultSort={{ key: 'publishedAt', direction: 'desc' }}
          onSortChange={onSortChange}
        >
          {(video, index) => (
            <tr key={video.id}>
              <EditableCell value={video.videoId} rowIndex={index} columnId="videoId" onChange={onVideoIdChange} />
              <td>
                {video.thumbnailDefaultUrl ? (
                  <Image src={video.thumbnailDefaultUrl} width={96} height={54} objectFit="cover" alt={video.title} />
                ) : null}
              </td>
              <td>{video.title}</td>
              <td>{video.duration}</td>
              <td>{format(new Date(video.publishedAt), 'yyyy/MM/dd HH:mm')}</td>
              <td>
                <Button variant="secondary" onClick={onDelete(video)}>
                  DELETE
                </Button>
              </td>
            </tr>
          )}
        </Table>
      )}
    </Layout>
  );
};

export default AdminVideosPage;