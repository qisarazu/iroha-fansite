import { motion } from 'framer-motion';
import { shuffle } from 'lodash-es';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MdQueueMusic } from 'react-icons/md';

import { Layout } from '../../../components/Layout/Layout';
import { MobilePlayerController } from '../../../components/MobilePlayerController/MobilePlayerController';
import { PlayerController } from '../../../components/PlayerController/PlayerController';
import { Playlist } from '../../../components/Playlist/Playlist';
import type { RepeatType } from '../../../components/RepeatButton/RepeatButton';
import { YTPlayer } from '../../../components/YTPlayer/YTPlayer';
import { useGetSingingStreamApi } from '../../../hooks/api/singing-streams/useGetSingingStreamApi';
import { useGetSingingStreamsApi } from '../../../hooks/api/singing-streams/useGetSingingStreamsApi';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useIsPlayedVideos } from '../../../hooks/useIsPlayedVideos';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useYTPlayer } from '../../../hooks/useYTPlayer';
import { usePlaylistDetails } from '../../../services/playlists/client';
import type { SingingStreamWatchPageQuery } from '../../../types/query';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { getMusicWatchURL } from '../../../utils/urls';
import styles from './index.module.scss';

// Since player.removeEventListener doesn't work, manage state used in onStateChange as local variable.
let repeatTypeVariable: RepeatType = 'none';
let startSeconds = 0;
let endSeconds = 0;

const SKIP_PREV_TIME = 5;

export default function SingingStreamsWatchPage() {
  const reqIdRef = useRef<number>();
  const router = useRouter();
  const { v: streamId, playlist: playlistId, shuffle: isShuffle } = router.query as SingingStreamWatchPageQuery;

  const { data: currentStream } = useGetSingingStreamApi(streamId);
  const { data: rawStreams } = useGetSingingStreamsApi({ request: { all: true } });

  const { playlist } = usePlaylistDetails(playlistId);

  const [isPlaying, setPlaying] = useState(false);
  const [isEnded, setEnded] = useState(false);
  const [isPlayedOnce, setPlayedOnce] = useState(false);
  const [isShuffledOnce, setShuffledOnce] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMobilePlaylistVisible, setMobilePlaylistVisible] = useState(false);
  const [streams, setStreams] = useState<SingingStreamWithVideoAndSong[]>([]);

  const [isMute, setMute] = useLocalStorage('isMute', false);
  const [repeatType, setRepeatType] = useLocalStorage<RepeatType>('repeatType', 'none');
  const [volume, setVolume] = useLocalStorage('volume', 80);

  const isMobile = useIsMobile();
  const { isPlayedVideo, addPlayedVideo } = useIsPlayedVideos();

  const isFirstStream = useMemo(
    () => (streams ? streams.findIndex((stream) => stream.id === streamId) === 0 : false),
    [streams, streamId],
  );

  const isLastStream = useMemo(
    () => (streams ? streams.findIndex((stream) => stream.id === streamId) === streams.length - 1 : false),
    [streams, streamId],
  );

  const isSkipPrevDisabled = useMemo(() => {
    return isFirstStream && currentTime < SKIP_PREV_TIME && ['none', 'repeatOne'].includes(repeatType);
  }, [currentTime, isFirstStream, repeatType]);

  const isSkipNextDisabled = useMemo(() => {
    return isLastStream && ['none', 'repeatOne'].includes(repeatType);
  }, [isLastStream, repeatType]);

  const { player, ...ytPlayerProps } = useYTPlayer({
    mountId: 'singing-stream-player',
    controls: false,
    autoplay: false,
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
    if (!streams || !currentStream || !player) return;

    // SKIP_PREV_TIME 以上経過している場合、前の曲には戻らず最初に再生時間を戻す
    if (currentTime >= SKIP_PREV_TIME) {
      player.seekTo(currentStream.start);
      setCurrentTime(0);
      return;
    }
    const playingStreamIndex = streams.findIndex((stream) => stream.id === currentStream.id);
    if (playingStreamIndex === 0) {
      if (repeatType === 'repeat') {
        // 最初の曲かつ、リピート再生の場合は最後の曲に移動
        router.push(getMusicWatchURL(streams[streams.length - 1].id, { playlist: playlistId }));
        return;
      } else {
        // そうでなければ何もしない
        return;
      }
    }

    // 前の曲へ遷移
    const prevStream = streams[playingStreamIndex - 1];
    if (prevStream) {
      router.push(getMusicWatchURL(prevStream.id, { playlist: playlistId }));
    }
  }, [currentStream, currentTime, player, playlistId, repeatType, router, streams]);

  const onSkipNext = useCallback(() => {
    if (!streams || !currentStream) return;

    const playingStreamIndex = streams.findIndex((stream) => stream.id === currentStream.id);
    if (playingStreamIndex === streams.length - 1) {
      if (repeatType === 'repeat') {
        // 最後の曲かつ、リピート再生の場合は最初の曲に戻る
        router.push(getMusicWatchURL(streams[0].id, { playlist: playlistId }));
        return;
      } else {
        // それ以外は何もしない
        return;
      }
    }

    // 次の曲へ遷移
    const nextStream = streams[playingStreamIndex + 1];
    if (nextStream) {
      router.push(getMusicWatchURL(nextStream.id, { playlist: playlistId }));
    }
  }, [currentStream, playlistId, repeatType, router, streams]);

  const onVolumeChange = useCallback(
    (value: number) => {
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
    (repeat: RepeatType) => {
      repeatTypeVariable = repeat;
      setRepeatType(repeat);
    },
    [setRepeatType],
  );

  const onStateChange = useCallback((event: { target: YT.Player; data: number }) => {
    // unplayed
    if (event.data === -1) {
      setPlayedOnce(false);
    }

    // ended
    if (event.data === 0) {
      if (repeatTypeVariable === 'repeatOne') {
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
      if (currentTime < startSeconds) {
        event.target.seekTo(startSeconds);
      } else if (currentTime > endSeconds) {
        setEnded(true);
        setPlaying(false);
      } else {
        setPlaying(true);
        setPlayedOnce(true);
      }
    } else {
      setPlaying(false);
    }
  }, []);

  const onMobilePlayerVisibleChange = useCallback(() => {
    setMobilePlaylistVisible((visible) => !visible);
  }, []);

  const onShuffle = useCallback(() => {
    if (!rawStreams || !currentStream) return;
    setStreams([currentStream].concat(shuffle(streams.filter((s) => s.id !== currentStream.id))));
    setShuffledOnce(true);
  }, [rawStreams, currentStream, streams]);

  // 初期化処理
  useEffect(() => {
    if (!rawStreams?.length) return;
    if (playlistId && !playlist) return;
    if (isShuffledOnce) return;

    const positionMap = new Map();
    playlist?.items.forEach((item) => positionMap.set(item.musicId, item.position));

    const filtered = playlist
      ? rawStreams.filter((stream) => playlist.items.some((item) => item.musicId === stream.id))
      : rawStreams;

    // シャッフル再生の場合
    if (isShuffle && currentStream) {
      setStreams([currentStream].concat(shuffle(filtered.filter((s) => s.id !== currentStream.id))));
      setShuffledOnce(true);
      return;
    }

    // プレイリスト再生の場合、アイテム順に並び替える
    if (playlist) {
      const sortedFiltered = filtered.sort((a, b) => positionMap.get(a.id) - positionMap.get(b.id));
      setStreams(sortedFiltered);
      return;
    }

    // それ以外はそのまま
    setStreams(filtered);
  }, [rawStreams?.length, playlist, playlistId, isShuffle, isShuffledOnce, currentStream]);

  // When repeatType is changed, the local variable is also changed.
  useEffect(() => {
    repeatTypeVariable = repeatType;
  }, [repeatType]);

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
    if (currentStream && player && !isPlayedOnce) {
      const param = {
        videoId: currentStream.video.videoId,
        startSeconds: currentStream.start,
        endSeconds: currentStream.end,
      };
      isPlayedVideo(currentStream.video.videoId) ? player.loadVideoById(param) : player.cueVideoById(param);
    }
  }, [player, currentStream, isPlayedVideo, isPlayedOnce]);

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
    const nextStreamId =
      playingStreamIndex === streams.length - 1
        ? repeatType === 'repeat'
          ? streams[0].id
          : null
        : streams[playingStreamIndex + 1]?.id;
    if (nextStreamId) {
      router.push(getMusicWatchURL(nextStreamId, { playlist: playlistId }));
    }
  }, [isEnded, isPlayedOnce, currentStream, streams, router, repeatType, playlistId]);

  useEffect(() => {
    if (!isPlayedOnce || !currentStream) return;

    if (!isPlayedVideo(currentStream.video.videoId)) {
      addPlayedVideo(currentStream.video.videoId);
    }
  }, [currentStream, isPlayedOnce, isPlayedVideo, addPlayedVideo]);

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
              isSkipPrevDisabled={isSkipPrevDisabled}
              isSkipNextDisabled={isSkipNextDisabled}
              isShuffled={isShuffledOnce}
              needNativePlayPush={!isPlayedVideo(currentStream.video.videoId)}
              length={currentStream.end - currentStream.start}
              videoId={currentStream.video.videoId}
              publishedAt={currentStream.video.publishedAt}
              songTitle={currentStream.song.title}
              songArtist={currentStream.song.artist}
              currentTime={currentTime}
              repeatType={repeatType}
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
              isMute={isMute}
              isSkipPrevDisabled={isSkipPrevDisabled}
              isSkipNextDisabled={isSkipNextDisabled}
              isShuffled={isShuffledOnce}
              needNativePlayPush={!isPlayedVideo(currentStream.video.videoId)}
              length={currentStream.end - currentStream.start}
              repeatType={repeatType}
              volume={volume}
              videoId={currentStream.video.videoId}
              songTitle={currentStream.song.title}
              songArtist={currentStream.song.artist}
              publishedAt={currentStream.video.publishedAt}
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
