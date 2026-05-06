import { type ComponentPropsWithRef, useContext, useEffect, useMemo, useRef } from 'react';

import type { YTPlayer } from '../components/YTPlayer/YTPlayer';
import { YTPlayerContext } from '../contexts/ytplayer';

type YTPlayerOptions = NonNullable<ConstructorParameters<typeof YT.Player>[1]>;

type Args = {
  mountId: string;
  width?: YTPlayerOptions['width'];
  height?: YTPlayerOptions['height'];
  autoplay?: boolean;
  controls?: boolean;
  events?: YTPlayerOptions['events'];
};

export function useYTPlayer({ mountId, width, height, autoplay, controls, events }: Args): ComponentPropsWithRef<
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
      events,
    });
    return () => {
      unmountYTPlayer();
      container.replaceChildren();
    };
  }, [apiReady, autoplay, controls, events, height, setYTPlayer, unmountYTPlayer, width]);

  return useMemo(
    () => ({
      player,
      id: mountId,
      ref: containerRef,
    }),
    [player, mountId],
  );
}
