import { Layout } from '../../components/Layout/Layout';
import { Link } from '../../components/Link/Link';
import { Spinner } from '../../components/Spinner/Spinner';
import { EditableCell } from '../../components/Table/EditableCell/EditableCell';
import { Table } from '../../components/Table/Table';
import { useGetVideosApi } from '../../hooks/api/videos/useGetVideosApi';
import { usePostVideoApi } from '../../hooks/api/videos/usePostVideoApi';
import { usePutVideoApi } from '../../hooks/api/videos/usePutVideoApi';
import { useYouTubeVideoApiFetcher } from '../../hooks/api/youtube/useGetYouTubeVideoApi';

const AdminVideosPage = () => {
  const { data: videos, mutate } = useGetVideosApi();
  const { post } = usePostVideoApi();
  const { put } = usePutVideoApi();
  const youTubeVideosFetcher = useYouTubeVideoApiFetcher();

  const onAddRow = async () => {
    const newVideo = await post({
      videoId: '',
      title: '',
      duration: 0,
      publishedAt: new Date(),
    });
    mutate((state) => (state ? [...state, newVideo] : [newVideo]));
  };

  const onVideoIdChange = async (rowIndex: number, columnId: string, value: string | number) => {
    if (!value) return;
    const videoId = typeof value === 'number' ? value.toString() : value;
    const video = await youTubeVideosFetcher(videoId);

    await mutate(async (state) => {
      if (!state) return state;

      const newVideo = await put({
        ...state[rowIndex],
        videoId: video.id,
        title: video.title,
        duration: video.duration,
        publishedAt: new Date(video.publishedAt),
      });
      state[rowIndex] = newVideo;
      return state;
    });
  };

  return (
    <Layout title="videos">
      <h1>videos</h1>
      <ul>
        <li>
          <Link href="/admin/videos">videos</Link>
        </li>
        <li>
          <Link href="/admin/songs">songs</Link>
        </li>
        <li>
          <Link href="/admin/singing-streams">singing-streams</Link>
        </li>
      </ul>
      {!videos ? (
        <Spinner />
      ) : (
        <Table data={videos} headers={['videoId', 'title', 'duration', 'publishedAt']}>
          {(video, index) => (
            <tr key={video.id}>
              <EditableCell value={video.videoId} rowIndex={index} columnId="videoId" onChange={onVideoIdChange} />
              <td>{video.title}</td>
              <td>{video.duration}</td>
              <td>{video.publishedAt}</td>
            </tr>
          )}
        </Table>
      )}
      <button onClick={onAddRow}>Add Row</button>
    </Layout>
  );
};

export default AdminVideosPage;
