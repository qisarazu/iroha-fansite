import { useCallback, useEffect, useState } from 'react';
import { SingingStreamListItem } from '../../components/SingingStreamListItem/SingingStreamListItem';
import { SingingStream } from '../../types';
import { supabase } from '../../utils/supabaseClient';

function SingingStreamsSearchPage() {
  const [videos, setVideos] = useState<SingingStream[]>([]);
  const getSingingStreams = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('singing_streams').select();
      if (error) {
        throw error;
      }

      if (data) {
        setVideos(data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getSingingStreams();
  }, [getSingingStreams]);

  if (!videos) return <div>Loading...</div>;
  return (
    <section>
      <h1>Search</h1>
      <main>
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <SingingStreamListItem video={video} />
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}

export default SingingStreamsSearchPage;
