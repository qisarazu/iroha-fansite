import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { MdRepeat } from 'react-icons/md';
import useSWR from 'swr';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import { SingingStream } from '../../../types';
import { fetcher } from '../../../utils/fetcher';

function SingingStreamsWatchPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: video } = useSWR<SingingStream>(
    id ? `/api/singing-streams/${id}` : null,
    fetcher
  );
  const [isRepeat, setRepeat] = useState(false);

  const onRepeatClick = useCallback(() => {
    setRepeat((state) => {
      localStorage.setItem('isRepeat', `${!state}`);
      return !state;
    });
  }, []);

  const seekToStartAt = useCallback(
    (player: YT.Player) => {
      if (!video) return;

      player.seekTo(video.startAt);
    },
    [video]
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
        if (video && event.target.getCurrentTime() < video.startAt) {
          seekToStartAt(event.target);
        }
      }
    },
    [isRepeat, seekToStartAt, video]
  );

  const YTPlayerProps = useYTPlayer({
    mountId: 'singing-stream-player',
    videoId: video?.id || '',
    options: {
      start: video?.startAt,
      end: video?.endAt,
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

  if (!video) return <div>loading...</div>;
  return (
    <section>
      <Link href="/singing-streams/search">
        <a>リストに戻る</a>
      </Link>
      <h1>watch</h1>
      <main>
        <YTPlayer {...YTPlayerProps} />
      </main>
      <footer>
        <button onClick={onRepeatClick}>
          <MdRepeat color={isRepeat ? '#000' : '#aaa'} />
        </button>
      </footer>
    </section>
  );
}

export default SingingStreamsWatchPage;
