import * as Sentry from '@sentry/nextjs';
import Script from 'next/script';
import { createContext, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

type YTPlayerContext = {
  player: YT.Player | null;
  apiReady: boolean;
  setYTPlayer: (mountElement: HTMLElement, options?: ConstructorParameters<typeof YT.Player>[1]) => void;
  unmountYTPlayer: () => void;
};

export const YTPlayerContext = createContext<YTPlayerContext>({} as YTPlayerContext);

export function YTPlayerContextProvider({ children }: { children: ReactNode }) {
  const [apiReady, setApiReady] = useState(false);
  const [player, setPlayer] = useState<YTPlayerContext['player']>(null);

  // 初期化中の player と利用可能な player を分けて保持し、古い onReady の反映を防ぐ。
  const playerRef = useRef<YT.Player | null>(null);
  const pendingPlayerRef = useRef<YT.Player | null>(null);
  const playerIdRef = useRef(0);

  // ページ遷移や Strict Mode の再マウント時に残った iframe player を破棄する。
  const destroyYTPlayer = useCallback((ytPlayer: YT.Player | null) => {
    try {
      ytPlayer?.destroy();
    } catch {
      // iframe の初期化と cleanup が競合すると IFrame API が例外を投げることがある。
    }
  }, []);

  /**
   * 現在の player を無効化し、初期化中または利用中の player を破棄して context の公開状態をリセットする。
   */
  const resetYTPlayer = useCallback(() => {
    playerIdRef.current += 1;
    destroyYTPlayer(playerRef.current);
    if (pendingPlayerRef.current !== playerRef.current) {
      destroyYTPlayer(pendingPlayerRef.current);
    }
    playerRef.current = null;
    pendingPlayerRef.current = null;
    setPlayer(null);
  }, [destroyYTPlayer]);

  const setYTPlayer = useCallback(
    (mountElement: HTMLElement, options?: ConstructorParameters<typeof YT.Player>[1]) => {
      // 新しい player を作る前に既存の player を無効化し、後続の onReady を世代で判定する。
      resetYTPlayer();

      const playerId = playerIdRef.current;
      const ytPlayer = new YT.Player(mountElement, {
        ...options,
        host: 'https://www.youtube-nocookie.com',
        events: {
          ...options?.events,
          onReady: (event) => {
            options?.events?.onReady?.(event);

            // 古い player の onReady が後から発火した場合は context に公開しない。
            if (playerId !== playerIdRef.current) {
              destroyYTPlayer(event.target);
              return;
            }

            pendingPlayerRef.current = null;
            playerRef.current = event.target;
            setPlayer(event.target);
          },
          onError: (event) => {
            options?.events?.onError?.(event);
            Sentry.captureMessage('YouTube player error', {
              level: 'error',
              tags: {
                feature: 'youtube-player',
                operation: 'player-error',
              },
              extra: {
                errorCode: event.data,
              },
            });
          },
        },
      });

      // onReady 前に unmount された player も破棄できるよう、初期化中のインスタンスを保持する。
      pendingPlayerRef.current = ytPlayer;
    },
    [destroyYTPlayer, resetYTPlayer],
  );

  // YouTube IFrame API の ready callback を登録し、登録前に ready 済みのケースも拾う。
  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };

    if (window.YT?.Player) {
      setApiReady(true);
    }
  }, []);

  // watch ページの unmount 時に現在の player を無効化し、iframe の後始末を provider 側に集約する。
  const unmountYTPlayer = useCallback(() => {
    resetYTPlayer();
  }, [resetYTPlayer]);

  return (
    <YTPlayerContext.Provider value={{ player, apiReady, setYTPlayer, unmountYTPlayer }}>
      {children}
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
    </YTPlayerContext.Provider>
  );
}
