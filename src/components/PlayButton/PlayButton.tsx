import { Tooltip } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { useT } from '@transifex/react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';

import { IconButton } from '../IconButton/IconButton';

type Props = {
  needNativePlayPush: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
};

export const PlayButton = memo(({ needNativePlayPush, isPlaying, onPlay, onPause }: Props) => {
  const t = useT();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const { ref, hovered } = useHover<HTMLButtonElement>();

  const onPlayClick = useCallback(() => {
    if (needNativePlayPush) {
      setShowTooltip(true);
    } else {
      onPlay();
    }
  }, [needNativePlayPush, onPlay]);

  useEffect(() => {
    if (needNativePlayPush && hovered) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [hovered, needNativePlayPush]);

  return (
    <>
      <Tooltip label={t('YouTubeプレイヤーをクリックして再生してください')} placement="start" opened={showTooltip}>
        {isPlaying ? (
          <IconButton
            size="xl"
            aria-label={t('停止', { _context: 'aria-label', _comment: 'The aria-label applied to the stop button' })}
            onClick={onPause}
            ref={buttonRef}
          >
            <MdPause />
          </IconButton>
        ) : (
          <IconButton
            size="xl"
            aria-label={t('再生', { _context: 'aria-label', _comment: 'The aria-label applied to the start button' })}
            onClick={onPlayClick}
            disabled={needNativePlayPush}
            ref={ref}
          >
            <MdPlayArrow />
          </IconButton>
        )}
      </Tooltip>
    </>
  );
});
