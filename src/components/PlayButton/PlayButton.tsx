import { useT, UT } from '@transifex/react';
import clsx from 'clsx';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { usePopper } from 'react-popper';

import { useHovering } from '../../hooks/useHovering';
import { IconButton } from '../IconButton/IconButton';
import styles from './PlayButton.module.scss';

type Props = {
  needNativePlayPush: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
};

export const PlayButton = memo(({ needNativePlayPush, isPlaying, onPlay, onPause }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popperRef, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [showPopper, setShowPopper] = useState(false);
  const isHovering = useHovering(buttonRef);
  const onPlayClick = useCallback(() => {
    if (needNativePlayPush) {
      setShowPopper(true);
    } else {
      onPlay();
    }
  }, [needNativePlayPush, onPlay]);

  const { styles: popperStyles, attributes } = usePopper(buttonRef.current, popperRef, {
    placement: 'top',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }, { name: 'flip' }],
  });

  useEffect(() => {
    if (needNativePlayPush && isHovering) {
      setShowPopper(true);
    } else {
      setShowPopper(false);
    }
  }, [isHovering, needNativePlayPush]);
  const t = useT();

  return (
    <>
      {isPlaying ? (
        <IconButton
          size="large"
          aria-label={t('停止', { _context: 'aria-label', _comment: 'The aria-label applied to the stop button' })}
          onClick={onPause}
          ref={buttonRef}
        >
          <MdPause />
        </IconButton>
      ) : (
        <IconButton
          className={clsx(styles.play, { [styles['disabled']]: needNativePlayPush })}
          size="large"
          aria-label={t('再生', { _context: 'aria-label', _comment: 'The aria-label applied to the start button' })}
          onClick={onPlayClick}
          ref={buttonRef}
        >
          <MdPlayArrow />
        </IconButton>
      )}
      {showPopper ? (
        <div {...attributes.popper} style={popperStyles.popper} className={styles.tips} ref={setPopperElement}>
          <UT
            _str="<p>YouTubeプレイヤーをクリックして</p><p>再生してください</p>"
            _comment="Please wrap text with <p> in a length appropriate for tooltips."
            _inline
          />
        </div>
      ) : null}
    </>
  );
});
