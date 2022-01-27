import { ComponentPropsWithoutRef, useContext, useEffect } from 'react';
import type { YTPlayer } from '../components/YTPlayer/YTPlayer';
import { YTPlayerContext } from '../contexts/ytplayer';

type Args = {
  mountId: string;
  videoId: string;
  options?: {
    width?: number;
    height?: number;
    start?: number;
    end?: number;
    autoplay?: boolean;
    controls?: boolean;
  };
};

export function useYTPlayer({ mountId, videoId, options }: Args): ComponentPropsWithoutRef<typeof YTPlayer> & {
  player: YT.Player | null;
} {
  const { player, setYTPlayer, scriptLoaded, unmountYTPlayer } = useContext(YTPlayerContext);

  useEffect(() => {
    if (!scriptLoaded || !videoId) return;
    setYTPlayer(mountId, {
      videoId,
      width: options?.width,
      height: options?.height,
      playerVars: {
        start: options?.start,
        end: options?.end,
        controls: options?.controls ? 1 : 0,
        autoplay: options?.autoplay ? 1 : 0,
        origin: location.origin,
        widget_referrer: location.origin,
      },
    });

    return () => {
      if (!scriptLoaded || !videoId) return;
      unmountYTPlayer();
    };
  }, [
    mountId,
    options?.autoplay,
    options?.controls,
    options?.end,
    options?.height,
    options?.start,
    options?.width,
    scriptLoaded,
    setYTPlayer,
    unmountYTPlayer,
    videoId,
  ]);

  return {
    player,
    id: mountId,
  };
}
