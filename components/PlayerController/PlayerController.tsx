import Image from 'next/image';
import { useCallback, useRef } from 'react';
import { MdPause, MdPlayArrow, MdRepeat, MdVolumeUp } from 'react-icons/md';
import { useHoverDirty } from 'react-use';
import { formatVideoLength } from '../../utils/formatVideoLength';
import { Slider } from '../Slider/Slider';
import styles from './PlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isRepeat: boolean;
  volume: number;
  currentTime: number;
  length: number;
  videoId: string;
  songTitle: string;
  songArtist: string;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRepeat: (isRepeat: boolean) => void;
  onVolumeChange: (volume: number) => void;
};

export function PlayerController({
  isPlaying,
  isRepeat,
  volume,
  currentTime,
  length,
  videoId,
  songTitle,
  songArtist,
  onPlay,
  onPause,
  onSeek,
  onRepeat,
  onVolumeChange,
}: Props) {
  const controllerRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const isControllerHovering = useHoverDirty(controllerRef);
  const isVolumeHovering = useHoverDirty(volumeRef);

  const onPlayClick = useCallback(() => {
    onPlay();
  }, [onPlay]);

  const onPauseClick = useCallback(() => {
    onPause();
  }, [onPause]);

  const onRepeatClick = useCallback(() => {
    onRepeat(!isRepeat);
  }, [isRepeat, onRepeat]);

  return (
    <div className={styles.controller} ref={controllerRef}>
      <div className={styles.leftControls}>
        {isPlaying ? (
          <button onClick={onPauseClick}>
            <MdPause />
          </button>
        ) : (
          <button onClick={onPlayClick}>
            <MdPlayArrow />
          </button>
        )}
        <span>{`${formatVideoLength(currentTime)} / ${formatVideoLength(length)}`}</span>
      </div>
      <div className={styles.middleControls}>
        <Image
          alt={songTitle}
          width={96}
          height={54}
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          objectFit="cover"
        />
        <span>{songTitle}</span>
        <span>{songArtist}</span>
      </div>
      <div className={styles.rightControls}>
        <div ref={volumeRef}>
          <MdVolumeUp />
          {isVolumeHovering || isControllerHovering ? (
            <Slider value={volume} onScrub={onVolumeChange} label={value => Math.floor(value)} labelDisplay />
          ) : null}
        </div>
        <button onClick={onRepeatClick}>
          <MdRepeat color={isRepeat ? '#000' : '#aaa'} />
        </button>
      </div>
      <Slider
        className={styles.slider}
        value={currentTime}
        max={length}
        label={(value) => formatVideoLength(value)}
        onScrub={onSeek}
        labelDisplay
      />
    </div>
  );
}
