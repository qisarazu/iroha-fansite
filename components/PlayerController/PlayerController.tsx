import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdPause, MdPlayArrow, MdRepeatOne, MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { useHoverDirty } from 'react-use';
import { formatVideoLength } from '../../utils/formatVideoLength';
import { IconButton } from '../IconButton/IconButton';
import { Slider } from '../Slider/Slider';
import styles from './PlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isMute: boolean;
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
  onMute: (mute: boolean) => void;
  onRepeat: (isRepeat: boolean) => void;
  onVolumeChange: (volume: number) => void;
};

export function PlayerController({
  isPlaying,
  isMute,
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
  onMute,
  onRepeat,
  onVolumeChange,
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
    <div className={styles.controller} onMouseEnter={onControllerMouseEnter} onMouseLeave={onControllerMouseLeave}>
      <Slider
        className={styles.slider}
        value={currentTime}
        max={length}
        label={(value) => formatVideoLength(value)}
        onScrub={onSeek}
        labelDisplay
      />
      <div className={styles.leftControls}>
        {isPlaying ? (
          <IconButton size="large" onClick={onPause}>
            <MdPause />
          </IconButton>
        ) : (
          <IconButton size="large" onClick={onPlay}>
            <MdPlayArrow />
          </IconButton>
        )}
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
        <div>
          <div>{songTitle}</div>
          <div>{songArtist}</div>
        </div>
      </div>
      <div className={styles.rightControls}>
        <div className={styles.volume} ref={volumeRef}>
          {visibleVolumeControl ? (
            <div className={styles.volumeControl}>
              <Slider value={volume} onScrub={onVolumeChange} label={(value) => Math.floor(value)} labelDisplay />
            </div>
          ) : null}
          <IconButton onClick={onMuteClick}>{isMute || volume === 0 ? <MdVolumeOff /> : <MdVolumeUp />}</IconButton>
        </div>
        <IconButton onClick={onRepeatClick}>
          <MdRepeatOne color={isRepeat ? '#ffffff' : '#757575'} />
        </IconButton>
      </div>
    </div>
  );
}
