import useSWR from 'swr';
import { SingingStreamListItem } from '../../components/SingingStreamListItem/SingingStreamListItem';
import { SingingStream } from '../../types';
import { fetcher } from '../../utils/fetcher';

function SingingStreamsSearchPage() {
  const { data: videos, error } = useSWR<SingingStream[]>('/api/singing-streams', fetcher);
  if (!videos) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <section>
      <h1>Search</h1>
      <main>
        <ul>
          {videos.map((video) => (
            <li key={video.songId}>
              <SingingStreamListItem video={video} />
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}

export default SingingStreamsSearchPage;
