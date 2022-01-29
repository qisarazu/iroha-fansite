import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Layout } from '../../../components/Layout/Layout';
import { MobilePlayerController } from '../../../components/MobilePlayerController/MobilePlayerController';
import { PlayerController } from '../../../components/PlayerController/PlayerController';
import { Spinner } from '../../../components/Spinner/Spinner';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useSingingStreamForWatch } from '../../../hooks/singing-stream';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import styles from './[id].module.scss';

// Since player.removeEventListener doesn't work, manage state used in onStateChange as local variable.
let isRepeatVariable = false;

function SingingStreamsWatchPage() {
  const router = useRouter();
  const id = router.query.id as string | undefined;
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMute, setMute] = useLocalStorage('isMute', false);
  const [isRepeat, setRepeat] = useLocalStorage('isRepeat', false);
  const [volume, setVolume] = useLocalStorage('volume', 80);
  const isMobile = useIsMobile();
  const { stream } = useSingingStreamForWatch(id);

  const { player, ...ytPlayerProps } = useYTPlayer({
    mountId: 'singing-stream-player',
    videoId: stream?.video_id || '',
    options: {
      start: stream?.start,
      end: stream?.end,
      controls: false,
      autoplay: true,
      width: '100%',
      height: '100%',
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
      setVolume(value);
    },
    [player, setVolume],
  );

  const onMute = useCallback(
    (mute: boolean) => {
      mute ? player?.mute() : player?.unMute();
      setMute(mute);
    },
    [player, setMute],
  );

  const onSeek = useCallback(
    (time: number) => {
      if (!player || !stream) return;
      player.seekTo(stream.start + time);
    },
    [player, stream],
  );

  const onRepeat = useCallback(
    (repeat) => {
      isRepeatVariable = repeat;
      setRepeat(repeat);
    },
    [setRepeat],
  );

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
        if (isRepeatVariable) {
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
    isRepeatVariable = isRepeat;
  }, [isRepeat]);

  // Update current time
  useEffect(() => {
    if (!stream || !isPlaying || !player) return;

    let id: number;
    const step = () => {
      if (!player) return;
      const currentTime = player.getCurrentTime();
      setCurrentTime(Math.max(0, currentTime - stream.start));
      if (isPlaying) {
        requestAnimationFrame(step);
      }
    };
    id = requestAnimationFrame(step);
    return () => {
      id && cancelAnimationFrame(id);
    };
  }, [isPlaying, player, stream]);

  useEffect(() => {
    if (!player) return;
    player.setVolume(volume);
  }, [player, volume]);

  useEffect(() => {
    if (!player) return;
    player.addEventListener('onStateChange', onStateChange);
    return () => {
      player.removeEventListener('onStateChange', onStateChange);
    };
  }, [onStateChange, player]);

  return (
    <Layout title="歌枠視聴">
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
        <motion.div
          className={styles.controller}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ ease: 'circOut', duration: 0.5 }}
        >
          {isMobile ? (
            <MobilePlayerController
              isPlaying={isPlaying}
              isRepeat={isRepeat}
              length={stream.end - stream.start}
              videoId={stream.video_id}
              publishedAt={stream.published_at}
              songTitle={stream.song.title}
              songArtist={stream.song.artist}
              currentTime={currentTime}
              onPlay={onPlay}
              onPause={onPause}
              onRepeat={onRepeat}
              onSeek={onSeek}
            />
          ) : (
            <PlayerController
              isPlaying={isPlaying}
              isRepeat={isRepeat}
              isMute={isMute}
              length={stream.end - stream.start}
              volume={player.getVolume()}
              videoId={stream.video_id}
              songTitle={stream.song.title}
              songArtist={stream.song.artist}
              publishedAt={stream.published_at}
              currentTime={currentTime}
              onPlay={onPlay}
              onPause={onPause}
              onRepeat={onRepeat}
              onSeek={onSeek}
              onMute={onMute}
              onVolumeChange={onVolumeChange}
            />
          )}
        </motion.div>
      ) : null}
    </Layout>
  );
}

export default SingingStreamsWatchPage;
