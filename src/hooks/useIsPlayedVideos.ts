import { addMilliseconds, getTime } from 'date-fns';
import { omit } from 'lodash-es';
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type PlayedVideos = {
  [videoId: string]: number;
};

// 3　days
export const VALID_TIME = 1000 * 60 * 60 * 24 * 3;

export const useIsPlayedVideos = () => {
  const [playedVideos, setPlayedVideos] = useLocalStorage<PlayedVideos>('playedVideos', {});

  const isPlayedVideo = useCallback(
    (videoId: string) => {
      if (!playedVideos[videoId]) return false;
      return playedVideos[videoId] >= Date.now();
    },
    [playedVideos],
  );

  const addPlayedVideo = useCallback(
    (videoId: string) => {
      if (!isPlayedVideo(videoId)) {
        setPlayedVideos({ ...playedVideos, [videoId]: getTime(addMilliseconds(new Date(), VALID_TIME)) });
      }
    },
    [isPlayedVideo, playedVideos, setPlayedVideos],
  );

  const removePlayedVideo = useCallback(
    (videoId: string) => {
      if (playedVideos[videoId]) {
        setPlayedVideos(omit(playedVideos, videoId));
      }
    },
    [playedVideos, setPlayedVideos],
  );

  return {
    isPlayedVideo,
    addPlayedVideo,
    removePlayedVideo,
  };
};
