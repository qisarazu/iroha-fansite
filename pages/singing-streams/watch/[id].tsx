import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { MdRepeat } from 'react-icons/md';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useSingingStreamForWatch } from '../../../hooks/singing-stream';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import { Layout } from '../../../layout/Layout/Layout';

function SingingStreamsWatchPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [isRepeat, setRepeat] = useState(false);
  const { stream } = useSingingStreamForWatch(id);

  const onRepeatClick = useCallback(() => {
    setRepeat((state) => {
      localStorage.setItem('isRepeat', `${!state}`);
      return !state;
    });
  }, []);

  const seekToStartAt = useCallback(
    (player: YT.Player) => {
      if (!stream) return;

      player.seekTo(stream.start);
    },
    [stream]
  );

  const onStateChange = useCallback(
    (event: { target: YT.Player; data: number }) => {
      // ended
      if (event.data === 0) {
        if (isRepeat) {
          seekToStartAt(event.target);
        }
      }

      // playing
      if (event.data === 1) {
        if (
          stream &&
          stream.end < event.target.getCurrentTime() &&
          event.target.getCurrentTime() < stream.start
        ) {
          seekToStartAt(event.target);
        }
      }
    },
    [isRepeat, seekToStartAt, stream]
  );

  const ytPlayerProps = useYTPlayer({
    mountId: 'singing-stream-player',
    videoId: stream?.video_id || '',
    options: {
      start: stream?.start,
      end: stream?.end,
      controls: true,
      autoplay: true,
      width: 640,
      height: 360
    },
    events: {
      onStateChange
    }
  });

  // initialize watch page
  useEffect(() => {
    setRepeat(localStorage.getItem('isRepeat') === 'true');
  }, []);

  if (!stream) return <div>loading...</div>;
  return (
    <Layout title="歌枠視聴">
      <Link href="/singing-streams/search">
        <a>リストに戻る</a>
      </Link>
      <h1>watch</h1>
      <main>
        <YTPlayer {...ytPlayerProps} />
      </main>
      <footer>
        <button onClick={onRepeatClick}>
          <MdRepeat color={isRepeat ? '#000' : '#aaa'} />
        </button>
      </footer>
    </Layout>
  );
}

export default SingingStreamsWatchPage;
