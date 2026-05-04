import { type ComponentPropsWithRef, useContext, useEffect, useMemo, useRef } from 'react';

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

export function useYTPlayer({ mountId, width, height, autoplay, controls }: Args): ComponentPropsWithRef<
  typeof YTPlayer
> & {
  player: YT.Player | null;
} {
  const { player, setYTPlayer, apiReady, unmountYTPlayer } = useContext(YTPlayerContext);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!apiReady) return;

    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const mountElement = document.createElement('div');
    container.appendChild(mountElement);

    setYTPlayer(mountElement, {
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
      container.replaceChildren();
    };
  }, [apiReady, autoplay, controls, height, setYTPlayer, unmountYTPlayer, width]);

  return useMemo(
    () => ({
      player,
      id: mountId,
      ref: containerRef,
    }),
    [player, mountId],
  );
}
