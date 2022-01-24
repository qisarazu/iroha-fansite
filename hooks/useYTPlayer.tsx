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
  events?: {
    onStateChange?: (event: { target: YT.Player; data: number }) => void;
  };
};

export function useYTPlayer({
  mountId,
  videoId,
  options,
  events
}: Args): ComponentPropsWithoutRef<typeof YTPlayer> & {
  player: YT.Player | null;
} {
  const { player, setYTPlayer, ready } = useContext(YTPlayerContext);

  useEffect(() => {
    if (!ready || !videoId) return;
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
        widget_referrer: location.origin
      },
      events: {
        onStateChange: events?.onStateChange
      }
    });
  }, [
    events?.onStateChange,
    mountId,
    options?.end,
    options?.height,
    options?.start,
    options?.width,
    ready,
    setYTPlayer,
    videoId
  ]);

  return {
    player,
    id: mountId
  };
}
