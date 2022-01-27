import Script from 'next/script';
import { createContext, ReactNode, useCallback, useRef, useState } from 'react';

type YTPlayerContext = {
  player: YT.Player | null;
  scriptLoaded: boolean;
  setYTPlayer: (mountId: string, options?: ConstructorParameters<typeof YT.Player>[1]) => void;
  unmountYTPlayer: () => void;
};

export const YTPlayerContext = createContext<YTPlayerContext>({} as YTPlayerContext);

export function YTPlayerContextProvider({ children }: { children: ReactNode }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [player, setPlayer] = useState<YTPlayerContext['player']>(null);

  const onScriptLoad = useCallback(() => {
    setScriptLoaded(true);
  }, []);

  const onReady = useCallback(() => {
    setReady(true);
  }, []);

  const setYTPlayer = useCallback(
    (mountId: string, options?: ConstructorParameters<typeof YT.Player>[1]) => {
      setPlayer(
        new YT.Player(mountId, {
          ...options,
          events: {
            onReady,
          },
        }),
      );
    },
    [onReady],
  );

  const unmountYTPlayer = useCallback(() => {
    setReady(false);
    setPlayer(null);
  }, []);

  return (
    <YTPlayerContext.Provider value={{ player: ready ? player : null, scriptLoaded, setYTPlayer, unmountYTPlayer }}>
      {children}
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" onLoad={onScriptLoad} />
    </YTPlayerContext.Provider>
  );
}
