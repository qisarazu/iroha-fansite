import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { MdRepeat } from 'react-icons/md';
import { Slider } from '../../../components/Slider/Slider';
import { Spinner } from '../../../components/Spinner/Spinner';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useSingingStreamForWatch } from '../../../hooks/singing-stream';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import { Layout } from '../../../layout/Layout/Layout';
import { formatVideoLength } from '../../../utils/formatVideoLength';
import styles from './[id].module.scss';

function SingingStreamsWatchPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [isRepeat, setRepeat] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
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
    [stream],
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
        const currentTime = event.target.getCurrentTime?.() || 0;
        if (stream && (stream.end < currentTime || currentTime < stream.start)) {
          seekToStartAt(event.target);
        }
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    },
    [isRepeat, seekToStartAt, stream],
  );

  const { player, ...ytPlayerProps } = useYTPlayer({
    mountId: 'singing-stream-player',
    videoId: stream?.video_id || '',
    options: {
      start: stream?.start,
      end: stream?.end,
      controls: true,
      autoplay: true,
      width: 1280,
      height: 720,
    },
    events: {
      onStateChange,
    },
  });

  // Initialize watch page
  useEffect(() => {
    setRepeat(localStorage.getItem('isRepeat') === 'true');
  }, []);

  // Update current time
  useEffect(() => {
    let id: number;
    if (stream && isPlaying) {
      const step = () => {
        if (!player || !player.getCurrentTime) return;

        const currentTime = player.getCurrentTime();
        setCurrentTime(Math.max(0, currentTime - stream.start));
        if (isPlaying) {
          requestAnimationFrame(step);
        }
      };
      id = requestAnimationFrame(step);
    }
    return () => {
      id && cancelAnimationFrame(id);
    };
  }, [isPlaying, player, stream]);

  if (!stream)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  return (
    <Layout title="歌枠視聴">
      <Link href="/singing-streams/search">
        <a>リストに戻る</a>
      </Link>
      <h1 className={styles.title}>watch</h1>
      <main className={styles.main}>
        <YTPlayer className={styles.player} {...ytPlayerProps} />
      </main>
      <div className={styles.controller}>
        <Slider
          className={styles.slider}
          value={currentTime}
          max={stream.end - stream.start}
          label={(value) => formatVideoLength(value)}
          labelDisplay
        />
        <button onClick={onRepeatClick}>
          <MdRepeat color={isRepeat ? '#000' : '#aaa'} />
        </button>
      </div>
    </Layout>
  );
}

export default SingingStreamsWatchPage;
