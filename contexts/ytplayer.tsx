import Script from 'next/script';
import { createContext, ReactNode, useCallback, useState } from 'react';

type YTPlayerContext = {
  player: YT.Player | null;
  ready: boolean;
  setYTPlayer: (mountId: string) => void;
};

export const YTPlayerContext = createContext<YTPlayerContext>(
  {} as YTPlayerContext
);

export function YTPlayerContextProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [player, setPlayer] = useState<YTPlayerContext['player']>(null);

  const onScriptLoad = useCallback(() => {
    YT.ready(() => {
      setReady(true);
    });
  }, []);

  const setYTPlayer = useCallback((mountId: string) => {
    setPlayer(new YT.Player(mountId));
  }, []);

  return (
    <YTPlayerContext.Provider value={{ player, ready, setYTPlayer }}>
      {children}
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />
    </YTPlayerContext.Provider>
  );
}
