import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { Layout } from '../../../components/Layout/Layout';
import { MobilePlayerController } from '../../../components/MobilePlayerController/MobilePlayerController';
import { PlayerController } from '../../../components/PlayerController/PlayerController';
import { Playlist } from '../../../components/Playlist/Playlist';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useSingingStreamForWatch, useSingingStreamsForSearch } from '../../../hooks/singing-stream';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import styles from './index.module.scss';

// Since player.removeEventListener doesn't work, manage state used in onStateChange as local variable.
let isRepeatVariable = false;
let startSeconds = 0;
let endSeconds = 0;

function SingingStreamsWatchPage() {
  const router = useRouter();
  const id = router.query.v as string | undefined;
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMute, setMute] = useLocalStorage('isMute', false);
  const [isRepeat, setRepeat] = useLocalStorage('isRepeat', false);
  const [volume, setVolume] = useLocalStorage('volume', 80);
  const isMobile = useIsMobile();
  const { stream } = useSingingStreamForWatch(id);
  const { streams } = useSingingStreamsForSearch();
  const [isMobilePlayerVisible, setMobilePlaylistVisible] = useState(false);

  const { player, ...ytPlayerProps } = useYTPlayer({
    mountId: 'singing-stream-player',
    controls: false,
    autoplay: true,
    width: '100%',
    height: '100%',
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
        if (endSeconds < currentTime || currentTime < startSeconds) {
          seekToStartAt(event.target);
        }
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    },
    [seekToStartAt],
  );

  const onMobilePlayerVisibleChange = useCallback((e, pointInfo) => {
    if ((e.target as Element).classList.contains(styles.draggable)) {
      if (pointInfo.delta.y < 0) {
        setMobilePlaylistVisible(true);
      } else {
        setMobilePlaylistVisible(false);
      }
    }
  }, []);

  // Initialize watch page
  useEffect(() => {
    isRepeatVariable = isRepeat;
  }, [isRepeat]);
  useEffect(() => {
    startSeconds = stream?.start ?? 0;
    endSeconds = stream?.end ?? 0;
  }, [stream?.start, stream?.end]);

  // Update current time
  useEffect(() => {
    let id: number;
    const step = () => {
      if (!player || !stream) return;
      const currentTime = player.getCurrentTime();
      setCurrentTime(Math.max(0, currentTime - stream.start));
      if (isPlaying) {
        id = requestAnimationFrame(step);
      }
    };
    id = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(id);
    };
  }, [isPlaying, player, stream]);

  useEffect(() => {
    if (!player) return;
    isMute ? player.mute() : player.unMute();
  }, [isMute, player]);

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

  useEffect(() => {
    if (stream && player) {
      player.loadVideoById({ videoId: stream.video_id, startSeconds: stream.start, endSeconds: stream.end });
    }
  }, [player, stream]);

  return (
    <Layout className={styles.root} title={stream?.song.title || ''} padding={isMobile ? 'all' : 'horizontal'}>
      <main className={styles.main}>
        <div className={styles.player}>
          <YTPlayer {...ytPlayerProps} hidden={!stream || !player} />
        </div>
        {!isMobile ? (
          streams ? (
            <Playlist className={styles.playlist} streams={streams} />
          ) : (
            <div className={styles.playlistSkeleton} />
          )
        ) : null}
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
      {isMobile && streams ? (
        <motion.div
          className={styles.mobilePlaylistWrapper}
          onPan={onMobilePlayerVisibleChange}
          animate={isMobilePlayerVisible ? 'visible' : 'hidden'}
          initial="hidden"
          transition={{ ease: 'circOut' }}
          variants={{
            visible: { y: 0 },
            hidden: { y: 'calc(100% - 36px)' },
          }}
        >
          <div className={styles.draggable} />
          <Playlist className={styles.mobilePlaylist} streams={streams} />
        </motion.div>
      ) : null}
    </Layout>
  );
}

export default SingingStreamsWatchPage;
