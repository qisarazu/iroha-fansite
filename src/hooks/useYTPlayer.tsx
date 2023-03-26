import { type ComponentPropsWithoutRef, useContext, useEffect, useMemo } from 'react';

import type { YTPlayer } from '../components/YTPlayer/YTPlayer';
import { YTPlayerContext } from '../contexts/ytplayer';

type Args = {
  mountId: string;
  width?: string | number;
  height?: string | number;
  start?: number;
  end?: number;
  autoplay?: boolean;
  controls?: boolean;
};

export function useYTPlayer({ mountId, width, height, autoplay, controls }: Args): ComponentPropsWithoutRef<
  typeof YTPlayer
> & {
  player: YT.Player | null;
} {
  const { player, setYTPlayer, scriptLoaded, apiReady, unmountYTPlayer } = useContext(YTPlayerContext);

  useEffect(() => {
    if (!scriptLoaded || !apiReady) return;
    setYTPlayer(mountId, {
      width: width,
      height: height,
      playerVars: {
        controls: controls ? 1 : 0,
        autoplay: autoplay ? 1 : 0,
        origin: location.origin,
        widget_referrer: location.origin,
      },
    });
    return () => {
      unmountYTPlayer();
    };
  }, [apiReady, autoplay, controls, height, mountId, scriptLoaded, setYTPlayer, unmountYTPlayer, width]);

  return useMemo(
    () => ({
      player,
      id: mountId,
    }),
    [player, mountId],
  );
}
