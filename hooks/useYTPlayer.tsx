import { useCallback, useContext, useEffect, useState } from 'react';
import { YTPlayerContext } from '../contexts/ytplayer';

type Args = {
  mountId: string;
  url: string;
  events?: {
    onStateChange?: (event: { target: YT.Player; data: number }) => void;
  };
};

export function useYTPlayer({ mountId, url, events }: Args) {
  const { player, setYTPlayer, ready } = useContext(YTPlayerContext);
  const [loaded, setLoaded] = useState(false);

  const onIframeLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!ready || !loaded) return;
    setYTPlayer(mountId);
  }, [loaded, mountId, ready, setYTPlayer]);

  return {
    player,
    id: mountId,
    onIframeLoad,
    src: url,
    events
  };
}
