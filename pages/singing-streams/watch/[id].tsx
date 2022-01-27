import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { PlayerController } from '../../../components/PlayerController/PlayerController';
import { Spinner } from '../../../components/Spinner/Spinner';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useSingingStreamForWatch } from '../../../hooks/singing-stream';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import { Layout } from '../../../layout/Layout/Layout';
import styles from './[id].module.scss';

// Since player.removeEventListener doesn't work, manage state used in onStateChange as local variable.
let isRepeat = false;

function SingingStreamsWatchPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [isMute, setMute] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { stream } = useSingingStreamForWatch(id);

  const { player, ...ytPlayerProps } = useYTPlayer({
    mountId: 'singing-stream-player',
    videoId: stream?.video_id || '',
    options: {
      start: stream?.start,
      end: stream?.end,
      controls: false,
      autoplay: true,
      width: 1280,
      height: 720,
    },
  });

  const onPlay = useCallback(() => {
    if (!player) return;
    player.playVideo();
  }, [player]);

  const onPause = useCallback(() => {
    if (!player) return;
    player.pauseVideo();
  }, [player]);

  const onVolumeChange = useCallback(
    (value) => {
      if (!player) return;
      player.setVolume(value);
      localStorage.setItem('volume', value);
    },
    [player],
  );

  const onMuteClick = useCallback(
    (mute: boolean) => {
      setMute(mute);
      mute ? player?.mute() : player?.unMute();
      localStorage.setItem('muted', `${mute}`);
    },
    [player],
  );

  const onSeek = useCallback(
    (time: number) => {
      if (!player || !stream) return;
      player.seekTo(stream.start + time);
    },
    [player, stream],
  );

  const onRepeatClick = useCallback((repeat) => {
    isRepeat = repeat;
    localStorage.setItem('isRepeat', `${repeat}`);
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
        const currentTime = event.target.getCurrentTime();
        if (stream && (stream.end < currentTime || currentTime < stream.start)) {
          seekToStartAt(event.target);
        }
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    },
    [seekToStartAt, stream],
  );

  // Initialize watch page
  useEffect(() => {
    isRepeat = localStorage.getItem('isRepeat') === 'true';
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

  useEffect(() => {
    if (!player) return;
    player.setVolume(parseInt(localStorage.getItem('volume') || '80', 10));
    localStorage.getItem('muted') === 'true' ? player.mute() : player.unMute();
  }, [player]);

  useEffect(() => {
    if (!player) return;
    player.addEventListener('onStateChange', onStateChange);
    return () => {
      player.removeEventListener('onStateChange', onStateChange);
    };
  }, [onStateChange, player]);

  return (
    <Layout title="歌枠視聴">
      <Link href="/singing-streams/search">
        <a>リストに戻る</a>
      </Link>
      <h1 className={styles.title}>watch</h1>
      <main className={styles.main}>
        <div className={styles.player}>
          {!stream || !player ? (
            <div className={styles.playerSpinner}>
              <Spinner />
            </div>
          ) : null}
          <YTPlayer {...ytPlayerProps} hidden={!stream || !player} />
        </div>
      </main>
      {stream && player ? (
        <PlayerController
          isPlaying={isPlaying}
          isRepeat={isRepeat}
          isMute={isMute}
          length={stream.end - stream.start}
          volume={player.getVolume()}
          videoId={stream.video_id}
          songTitle={stream.song.title}
          songArtist={stream.song.artist}
          currentTime={currentTime}
          onPlay={onPlay}
          onPause={onPause}
          onRepeat={onRepeatClick}
          onSeek={onSeek}
          onMute={onMuteClick}
          onVolumeChange={onVolumeChange}
        />
      ) : null}
    </Layout>
  );
}

export default SingingStreamsWatchPage;
