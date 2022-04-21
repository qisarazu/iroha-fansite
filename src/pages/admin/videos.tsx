import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridCellEditCommitParams,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import type { Video } from '@prisma/client';
import withAuthRequired from '@supabase/supabase-auth-helpers/nextjs/utils/withAuthRequired';
import { format } from 'date-fns';
import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { MdDelete } from 'react-icons/md';

import { LinkList } from '../../components/features/admin/LinkList/LinkList';
import { Layout } from '../../components/Layout/Layout';
import { useDeleteVideoApi } from '../../hooks/api/videos/useDeleteVideoApi';
import { useGetVideosApi } from '../../hooks/api/videos/useGetVideosApi';
import { usePostVideoApi } from '../../hooks/api/videos/usePostVideoApi';
import { usePutVideoApi } from '../../hooks/api/videos/usePutVideoApi';
import { useYouTubeVideoApiFetcher } from '../../hooks/api/youtube/useGetYouTubeVideoApi';
import { theme } from '../../styles/theme';

export const getServerSideProps = withAuthRequired({ redirectTo: '/' });

const AdminVideosPage = () => {
  const { data: videos, isLoading, mutate } = useGetVideosApi();
  const { api: postVideo } = usePostVideoApi({ mutate });
  const { api: putVideo } = usePutVideoApi({ mutate });
  const { api: deleteVideo } = useDeleteVideoApi({ mutate });
  const getYouTubeVideo = useYouTubeVideoApiFetcher();

  const onAddRow = useCallback(async () => {
    await postVideo({
      videoId: '',
      title: '',
      duration: 0,
      thumbnailDefaultUrl: '',
      thumbnailMediumUrl: '',
      thumbnailHighUrl: '',
      publishedAt: new Date(),
    });
  }, [postVideo]);

  const onDelete = useCallback(
    (video: Video) => () => {
      if (confirm(`[${video.videoId}]\n${video.title}\nこの動画を削除しますか?`)) {
        deleteVideo({ id: video.id });
      }
    },
    [deleteVideo],
  );

  const onVideoIdChange = useCallback(
    async ({ id, value }: GridCellEditCommitParams) => {
      if (!value || !id || typeof id !== 'string') return;
      const videoId = typeof value === 'number' ? value.toString() : value;
      const video = await getYouTubeVideo(videoId);

      await putVideo({
        id,
        videoId: video.id,
        title: video.title,
        duration: video.duration,
        thumbnailDefaultUrl: video.thumbnails.default,
        thumbnailMediumUrl: video.thumbnails.medium,
        thumbnailHighUrl: video.thumbnails.high,
        publishedAt: new Date(video.publishedAt),
      });
    },
    [getYouTubeVideo, putVideo],
  );

  const rows = useMemo<GridRowsProp>(() => {
    return videos.map((video) => ({
      id: video.id,
      videoId: video.videoId,
      title: video.title,
      duration: video.duration,
      thumbnail: video.thumbnailDefaultUrl,
      publishedAt: format(new Date(video.publishedAt), 'yyyy/MM/dd HH:mm:ss'),
      createdAt: format(new Date(video.createdAt), 'yyyy/MM/dd HH:mm:ss'),
      updatedAt: format(new Date(video.updatedAt), 'yyyy/MM/dd HH:mm:ss'),
    }));
  }, [videos]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'videoId',
        headerName: '動画ID',
        editable: true,
        width: 120,
      },
      {
        field: 'thumbnail',
        headerName: 'サムネイル',
        width: 80,
        renderCell: ({ value }: GridRenderCellParams) =>
          value ? <Image src={value} width={64} height={36} alt="value" objectFit="cover" /> : null,
      },
      {
        field: 'title',
        headerName: 'タイトル',
        flex: 1,
      },
      { field: 'duration', headerName: '動画長' },
      { field: 'publishedAt', headerName: '公開日', width: 160 },
      { field: 'createdAt', headerName: '作成日', width: 160 },
      { field: 'updatedAt', headerName: '更新日', width: 160 },
      {
        field: 'actions',
        type: 'actions',
        headerName: '削除',
        getActions: ({ row }: GridRowParams) => [
          <GridActionsCellItem key="delete" icon={<MdDelete />} label="削除" onClick={onDelete(row)} />,
        ],
      },
    ],
    [onDelete],
  );

  return (
    <Layout title="videos">
      <h1>videos</h1>
      <LinkList />
      <Button variant="contained" onClick={onAddRow}>
        Add Row
      </Button>
      <Box sx={{ my: theme.spacing(1), height: theme.spacing(100) }}>
        <DataGrid rows={rows} columns={columns} loading={isLoading} onCellEditCommit={onVideoIdChange} />
      </Box>
    </Layout>
  );
};

export default AdminVideosPage;
