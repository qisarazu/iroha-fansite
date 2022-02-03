import { motion } from 'framer-motion';
import { shuffle, without } from 'lodash-es';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MdQueueMusic } from 'react-icons/md';
import { Layout } from '../../../components/Layout/Layout';
import { MobilePlayerController } from '../../../components/MobilePlayerController/MobilePlayerController';
import { PlayerController } from '../../../components/PlayerController/PlayerController';
import { Playlist } from '../../../components/Playlist/Playlist';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useSingingStreamForWatch, useSingingStreamsForSearch } from '../../../hooks/singing-stream';
import { useIsMobile } from '../../../hooks/useIsMobile';
import useLocalStorage from '../../../hooks/useLocalStorage';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import type { SingingStreamForSearch } from '../../../types';
import styles from './index.module.scss';

// Since player.removeEventListener doesn't work, manage state used in onStateChange as local variable.
let isRepeatVariable = false;
let startSeconds = 0;
let endSeconds = 0;

function SingingStreamsWatchPage() {
  const reqIdRef = useRef<number>();
  const router = useRouter();
  const streamId = useMemo(() => {
    if (router.query.v && typeof router.query.v === 'string') {
      return router.query.v;
    }
    return;
  }, [router]);

  const { stream: currentStream } = useSingingStreamForWatch(streamId);
  const { streams: rawStreams } = useSingingStreamsForSearch();
  const isFirstStream = useMemo(
    () => (rawStreams ? rawStreams.findIndex((stream) => stream.id === streamId) === 0 : false),
    [rawStreams, streamId],
  );
  const isLastStream = useMemo(
    () => (rawStreams ? rawStreams.findIndex((stream) => stream.id === streamId) === rawStreams.length - 1 : false),
    [rawStreams, streamId],
  );

  const [isPlaying, setPlaying] = useState(false);
  const [isEnded, setEnded] = useState(false);
  const [isPlayedOnce, setPlayedOnce] = useState(false);
  const [isShuffledOnce, setShuffledOnce] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMobilePlaylistVisible, setMobilePlaylistVisible] = useState(false);
  const [streams, setStreams] = useState<SingingStreamForSearch[]>([]);

  const [isMute, setMute] = useLocalStorage('isMute', false);
  const [isRepeat, setRepeat] = useLocalStorage('isRepeat', false);
  const [volume, setVolume] = useLocalStorage('volume', 80);

  const isMobile = useIsMobile();

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

  const onSkipPrev = useCallback(() => {
    if (!streams || !currentStream) return;
    const playingStreamIndex = streams.findIndex((stream) => stream.id === currentStream.id);
    if (playingStreamIndex === 0) return;
    const prevStream = streams[playingStreamIndex - 1];
    if (prevStream) {
      router.push(`/singing-streams/watch?v=${prevStream.id}`);
    }
  }, [currentStream, router, streams]);

  const onSkipNext = useCallback(() => {
    if (!streams || !currentStream) return;
    const playingStreamIndex = streams.findIndex((stream) => stream.id === currentStream.id);
    if (playingStreamIndex === streams.length - 1) return;
    const nextStream = streams[playingStreamIndex + 1];
    if (nextStream) {
      router.push(`/singing-streams/watch?v=${nextStream.id}`);
    }
  }, [currentStream, router, streams]);

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
      if (!player || !currentStream) return;
      player.seekTo(currentStream.start + time);
    },
    [player, currentStream],
  );

  const onRepeat = useCallback(
    (repeat) => {
      isRepeatVariable = repeat;
      setRepeat(repeat);
    },
    [setRepeat],
  );

  const onStateChange = useCallback((event: { target: YT.Player; data: number }) => {
    // unplayed
    if (event.data === -1) {
      setPlayedOnce(false);
    }

    // ended
    if (event.data === 0) {
      if (isRepeatVariable) {
        event.target.seekTo(startSeconds);
      } else {
        setEnded(true);
      }
    } else {
      setEnded(false);
    }

    // playing
    if (event.data === 1) {
      const currentTime = event.target.getCurrentTime();
      if (endSeconds < currentTime || currentTime < startSeconds) {
        event.target.seekTo(startSeconds);
      }
      setPlaying(true);
      setPlayedOnce(true);
    } else {
      setPlaying(false);
    }
  }, []);

  const onMobilePlayerVisibleChange = useCallback(() => {
    setMobilePlaylistVisible((visible) => !visible);
  }, []);

  const onShuffle = useCallback(() => {
    if (!rawStreams || !streamId) return;
    const currentStream = rawStreams.find((stream) => stream.id === streamId);
    if (!currentStream) return;
    setStreams([currentStream].concat(shuffle(without(streams, currentStream))));
    setShuffledOnce(true);
  }, [rawStreams, streamId, streams]);

  useEffect(() => {
    if (rawStreams) {
      setStreams(rawStreams);
    }
  }, [rawStreams]);

  // When isRepeat is changed, the local variable is also changed.
  useEffect(() => {
    isRepeatVariable = isRepeat;
  }, [isRepeat]);

  // When the start and end of the stream are changed, the local variables are also changed.
  useEffect(() => {
    startSeconds = currentStream?.start ?? 0;
    endSeconds = currentStream?.end ?? 0;
  }, [currentStream?.start, currentStream?.end]);

  // Update current time
  useEffect(() => {
    const step = () => {
      if (!player || !currentStream) return;
      const currentTime = player.getCurrentTime() - currentStream.start;
      setCurrentTime(isNaN(currentTime) ? 0 : Math.max(0, currentTime));
      if (isPlaying) {
        reqIdRef.current = requestAnimationFrame(step);
      }
    };
    reqIdRef.current = requestAnimationFrame(step);
    return () => {
      reqIdRef.current && cancelAnimationFrame(reqIdRef.current);
    };
  }, [isPlaying, player, currentStream]);

  // Change mute status.
  useEffect(() => {
    if (!player) return;
    isMute ? player.mute() : player.unMute();
  }, [isMute, player]);

  // Update volume.
  useEffect(() => {
    if (!player) return;
    player.setVolume(volume);
  }, [player, volume]);

  // Add onStateChange event listener.
  useEffect(() => {
    if (!player) return;
    player.addEventListener('onStateChange', onStateChange);
    return () => {
      player.removeEventListener('onStateChange', onStateChange);
    };
  }, [onStateChange, player]);

  // when stream changes, load the video.
  useEffect(() => {
    if (currentStream && player) {
      player.loadVideoById({
        videoId: currentStream.video_id,
        startSeconds: currentStream.start,
        endSeconds: currentStream.end,
      });
    }
  }, [player, currentStream]);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentTime(0);
      setPlayedOnce(false);
      setEnded(false);
      setMobilePlaylistVisible(false);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // When the video ends, streams will be played in order.
  useEffect(() => {
    if (!streams || !isEnded || !isPlayedOnce || !currentStream) return;
    const playingStreamIndex = streams.findIndex((s) => s.id === currentStream.id);
    const nextStreamId = streams[playingStreamIndex + 1]?.id;
    if (nextStreamId) {
      router.push(`/singing-streams/watch?v=${nextStreamId}`);
    }
  }, [isEnded, isPlayedOnce, currentStream, streams, router]);

  return (
    <Layout className={styles.root} title={currentStream?.song.title || ''} padding={isMobile ? 'all' : 'horizontal'}>
      <main className={styles.main}>
        <div className={styles.player}>
          <YTPlayer {...ytPlayerProps} hidden={!currentStream || !player} />
        </div>
        {!isMobile ? (
          !rawStreams ? (
            <div className={styles.sidePanelSkeleton} />
          ) : (
            <div className={styles.sidePanel}>
              <Playlist className={styles.playlist} streams={streams} />
            </div>
          )
        ) : null}
      </main>
      {currentStream && player ? (
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
              isSkipPrevDisabled={isFirstStream}
              isSkipNextDisabled={isLastStream}
              isShuffled={isShuffledOnce}
              length={currentStream.end - currentStream.start}
              videoId={currentStream.video_id}
              publishedAt={currentStream.published_at}
              songTitle={currentStream.song.title}
              songArtist={currentStream.song.artist}
              currentTime={currentTime}
              onPlay={onPlay}
              onPause={onPause}
              onRepeat={onRepeat}
              onShuffle={onShuffle}
              onSeek={onSeek}
              onSkipPrev={onSkipPrev}
              onSkipNext={onSkipNext}
            />
          ) : (
            <PlayerController
              isPlaying={isPlaying}
              isRepeat={isRepeat}
              isMute={isMute}
              isSkipPrevDisabled={isFirstStream}
              isSkipNextDisabled={isLastStream}
              isShuffled={isShuffledOnce}
              length={currentStream.end - currentStream.start}
              volume={volume}
              videoId={currentStream.video_id}
              songTitle={currentStream.song.title}
              songArtist={currentStream.song.artist}
              publishedAt={currentStream.published_at}
              currentTime={currentTime}
              onPlay={onPlay}
              onPause={onPause}
              onSkipPrev={onSkipPrev}
              onSkipNext={onSkipNext}
              onRepeat={onRepeat}
              onShuffle={onShuffle}
              onSeek={onSeek}
              onMute={onMute}
              onVolumeChange={onVolumeChange}
            />
          )}
        </motion.div>
      ) : null}
      {isMobile && rawStreams ? (
        <motion.div
          className={styles.mobilePlaylistWrapper}
          animate={isMobilePlaylistVisible ? 'visible' : 'hidden'}
          initial="hidden"
          transition={{ ease: 'circOut' }}
          variants={{
            visible: { y: 0 },
            hidden: { y: 'calc(100% - 48px)' },
          }}
        >
          <button className={styles.mobilePlaylistVisibilityToggle} onClick={onMobilePlayerVisibleChange}>
            <MdQueueMusic />
          </button>
          <Playlist className={styles.mobilePlaylist} streams={streams} />
        </motion.div>
      ) : null}
    </Layout>
  );
}

export default SingingStreamsWatchPage;
