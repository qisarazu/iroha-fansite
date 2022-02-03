import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  MdPause,
  MdPlayArrow,
  MdRepeatOne,
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeOff,
  MdVolumeUp
} from 'react-icons/md';
import { useHoverDirty } from 'react-use';
import { formatVideoLength } from '../../utils/formatVideoLength';
import { IconButton } from '../IconButton/IconButton';
import { Slider } from '../Slider/Slider';
import styles from './PlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isMute: boolean;
  isRepeat: boolean;
  isShuffled: boolean;
  isSkipPrevDisabled: boolean;
  isSkipNextDisabled: boolean;
  volume: number;
  currentTime: number;
  length: number;
  videoId: string;
  songTitle: string;
  songArtist: string;
  publishedAt: string;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onMute: (mute: boolean) => void;
  onRepeat: (isRepeat: boolean) => void;
  onShuffle: () => void;
  onVolumeChange: (volume: number) => void;
  onSkipPrev: () => void;
  onSkipNext: () => void;
};

export const PlayerController = memo(function PlayerController({
  isPlaying,
  isMute,
  isRepeat,
  isShuffled,
  isSkipPrevDisabled,
  isSkipNextDisabled,
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

  const onRepeatClick = useCallback(() => {
    onRepeat(!isRepeat);
  }, [isRepeat, onRepeat]);

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
        <IconButton aria-label="前の曲" onClick={onSkipPrev} disabled={isSkipPrevDisabled}>
          <MdSkipPrevious />
        </IconButton>
        {isPlaying ? (
          <IconButton size="large" aria-label="停止" onClick={onPause}>
            <MdPause />
          </IconButton>
        ) : (
          <IconButton size="large" aria-label="再生" onClick={onPlay}>
            <MdPlayArrow />
          </IconButton>
        )}
        <IconButton aria-label="次の曲" onClick={onSkipNext} disabled={isSkipNextDisabled}>
          <MdSkipNext />
        </IconButton>
        <span className={styles.time}>{`${formatVideoLength(currentTime)} / ${formatVideoLength(length)}`}</span>
      </div>
      <div className={styles.middleControls}>
        <Image
          alt={songTitle}
          width={64}
          height={36}
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          objectFit="cover"
        />
        <div className={styles.info}>
          <div className={styles.sonTitle}>{songTitle}</div>
          <div>
            <span>{songArtist}</span>
            <span> / </span>
            <span>{format(new Date(publishedAt), 'yyyy-MM-dd')} 配信</span>
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
          <IconButton aria-label={isMute ? 'ミュートをやめる' : 'ミュートする'} onClick={onMuteClick}>
            {isMute || volume === 0 ? <MdVolumeOff /> : <MdVolumeUp />}
          </IconButton>
        </div>
        <IconButton
          className={clsx(styles.repeat, { [styles['repeating']]: isRepeat })}
          aria-label={isRepeat ? 'リピートをやめる' : 'リピートする'}
          onClick={onRepeatClick}
        >
          <MdRepeatOne color={isRepeat ? '#ffffff' : '#757575'} />
        </IconButton>
        <IconButton className={clsx(styles.shuffle, { [styles['shuffled']]: isShuffled })} onClick={onShuffle}>
          <MdShuffle />
        </IconButton>
      </div>
    </div>
  );
});
