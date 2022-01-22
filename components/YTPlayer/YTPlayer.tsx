import { useEffect } from 'react';

type Props = {
  id: string;
  src: string;
  player: YT.Player | null;
  onIframeLoad: () => void;
  onStateChange?: (event: { target: YT.Player; data: number }) => void;
};

export function YouTubePlayer({
  id,
  src,
  player,
  onIframeLoad,
  onStateChange
}: Props) {
  useEffect(() => {
    if (!player || !onStateChange) return;
    player.addEventListener('onStateChange', onStateChange);
    return () => {
      player.removeEventListener('onStateChange', onStateChange);
    };
  }, [onStateChange, player]);

  return (
    <iframe
      id={id}
      width="640"
      height="360"
      frameBorder="0"
      src={src}
      onLoad={onIframeLoad}
    ></iframe>
  );
}
