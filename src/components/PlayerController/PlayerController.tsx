import { T, useT } from '@transifex/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MdShuffle, MdSkipNext, MdSkipPrevious, MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { useHoverDirty } from 'react-use';

import { formatVideoLength } from '../../utils/formatVideoLength';
import { IconButton } from '../IconButton/IconButton';
import { PlayButton } from '../PlayButton/PlayButton';
import { RepeatButton, RepeatType } from '../RepeatButton/RepeatButton';
import { Slider } from '../Slider/Slider';
import styles from './PlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isMute: boolean;
  isShuffled: boolean;
  isSkipPrevDisabled: boolean;
  isSkipNextDisabled: boolean;
  needNativePlayPush: boolean;
  repeatType: RepeatType;
  volume: number;
  currentTime: number;
  length: number;
  videoId: string;
  songTitle: string;
  songArtist: string;
  publishedAt: Date;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onMute: (mute: boolean) => void;
  onRepeat: (type: RepeatType) => void;
  onShuffle: () => void;
  onVolumeChange: (volume: number) => void;
  onSkipPrev: () => void;
  onSkipNext: () => void;
};

export const PlayerController = memo(function PlayerController({
  isPlaying,
  isMute,
  isShuffled,
  isSkipPrevDisabled,
  isSkipNextDisabled,
  needNativePlayPush,
  repeatType,
  volume,
  currentTime,
  length,
  videoId,
  songTitle,
  songArtist,
  publishedAt,
  onPlay,
  onPause,
  onSeek,
  onMute,
  onRepeat,
  onShuffle,
  onVolumeChange,
  onSkipPrev,
  onSkipNext,
}: Props) {
  const volumeRef = useRef<HTMLDivElement>(null);
  const isVolumeHovered = useHoverDirty(volumeRef);
  const [isControllerHovering, setControllerHovering] = useState(false);
  const [visibleVolumeControl, setVisibleVolumeControl] = useState(false);

  useEffect(() => {
    setVisibleVolumeControl(true);
  }, [isVolumeHovered]);

  useEffect(() => {
    setVisibleVolumeControl((state) => state && isControllerHovering);
  }, [isControllerHovering]);

  const onControllerMouseEnter = useCallback(() => {
    setControllerHovering(true);
  }, []);

  const onControllerMouseLeave = useCallback(() => {
    setControllerHovering(false);
  }, []);

  const onMuteClick = useCallback(() => {
    onMute(!isMute);
  }, [isMute, onMute]);

  const t = useT();

  return (
    <div className={styles.root} onMouseEnter={onControllerMouseEnter} onMouseLeave={onControllerMouseLeave}>
      <Slider
        className={styles.slider}
        value={currentTime}
        max={length}
        label={(value) => formatVideoLength(value)}
        onScrub={onSeek}
        labelDisplay
      />
      <div className={styles.leftControls}>
        <IconButton
          aria-label={t('前の曲', {
            _context: 'aria-label',
            _comment:
              'The aria-label applied to the previous button both in the desktop player and in the mobile player',
          })}
          onClick={onSkipPrev}
          disabled={isSkipPrevDisabled}
        >
          <MdSkipPrevious />
        </IconButton>
        <PlayButton needNativePlayPush={needNativePlayPush} isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
        <IconButton
          aria-label={t('次の曲', {
            _context: 'aria-label',
            _comment: 'The aria-label applied to the next button both in the desktop player and in the mobile player',
          })}
          onClick={onSkipNext}
          disabled={isSkipNextDisabled}
        >
          <MdSkipNext />
        </IconButton>
        <span className={styles.time}>{`${formatVideoLength(currentTime)} / ${formatVideoLength(length)}`}</span>
      </div>
      <div className={styles.middleControls}>
        <Image
          alt={songTitle}
          width={64}
          height={36}
          src={`https://i.ytimg.com/vi/${videoId}/default.jpg`}
          style={{
            objectFit: 'cover',
          }}
        />
        <div className={styles.info}>
          <div className={styles.sonTitle}>{songTitle}</div>
          <div>
            <span>{songArtist}</span>
            <span> / </span>
            <span>
              <T
                _str="{date} 配信"
                _comment={
                  'The text that indicates when a source video is streamed. Used in the player, playlists, and search result.\n\ndate: yyyy-MM-dd (e.g. "2022-02-18")'
                }
                date={format(new Date(publishedAt), 'yyyy-MM-dd')}
              />
            </span>
          </div>
        </div>
      </div>
      <div className={styles.rightControls}>
        <div className={styles.volume} ref={volumeRef}>
          {visibleVolumeControl ? (
            <div className={styles.volumeControl}>
              <Slider value={volume} onScrub={onVolumeChange} label={(value) => Math.floor(value)} labelDisplay />
            </div>
          ) : null}
          <IconButton
            aria-label={
              isMute
                ? t('ミュートをやめる', {
                    _context: 'aria-label',
                    _comment: 'The aria-label applied to the unmute button',
                  })
                : t('ミュートする', { _context: 'aria-label', _comment: 'The aria-label applied to the mute button' })
            }
            onClick={onMuteClick}
          >
            {isMute || volume === 0 ? <MdVolumeOff /> : <MdVolumeUp />}
          </IconButton>
        </div>
        <RepeatButton type={repeatType} onClick={onRepeat} />
        <IconButton className={clsx(styles.shuffle, { [styles['shuffled']]: isShuffled })} onClick={onShuffle}>
          <MdShuffle />
        </IconButton>
      </div>
    </div>
  );
});
