import { addMilliseconds, formatISO, isAfter } from 'date-fns';
import { omit } from 'lodash-es';
import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

type PlayedVideos = {
  [videoId: string]: string;
};

// 3 days
const EXPIRY = 1000 * 60 * 60 * 24 * 3;

export const useIsPlayedVideo = () => {
  const [playedVideos, setPlayedVideos] = useLocalStorage<PlayedVideos>('playedVideos', {});

  const addPlayedVideo = useCallback(
    (videoId: string) => {
      if (!playedVideos[videoId]) {
        setPlayedVideos({ ...playedVideos, [videoId]: formatISO(addMilliseconds(new Date(), EXPIRY)) });
      }
    },
    [playedVideos, setPlayedVideos],
  );

  const removePlayedVideo = useCallback(
    (videoId: string) => {
      if (playedVideos[videoId]) {
        setPlayedVideos(omit(playedVideos, videoId));
      }
    },
    [playedVideos, setPlayedVideos],
  );

  const isPlayedVideo = useCallback(
    (videoId: string) => {
      if (!playedVideos[videoId]) return false;
      return isAfter(new Date(playedVideos[videoId]), new Date());
    },
    [playedVideos],
  );

  return {
    isPlayedVideo,
    addPlayedVideo,
    removePlayedVideo,
  };
};
