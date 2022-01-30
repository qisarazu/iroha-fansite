import { format } from 'date-fns';
import Image from 'next/image';
import { memo, useCallback } from 'react';
import { MdPause, MdPlayArrow, MdRepeatOne } from 'react-icons/md';
import { formatVideoLength } from '../../utils/formatVideoLength';
import { IconButton } from '../IconButton/IconButton';
import { Slider } from '../Slider/Slider';
import styles from './MobilePlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isRepeat: boolean;
  currentTime: number;
  length: number;
  videoId: string;
  songTitle: string;
  songArtist: string;
  publishedAt: string;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRepeat: (isRepeat: boolean) => void;
};

export const MobilePlayerController = memo(function MobilePlayerController({
  isPlaying,
  isRepeat,
  currentTime,
  length,
  videoId,
  songTitle,
  songArtist,
  publishedAt,
  onPlay,
  onPause,
  onSeek,
  onRepeat,
}: Props) {
  const onRepeatClick = useCallback(() => {
    onRepeat(!isRepeat);
  }, [isRepeat, onRepeat]);

  return (
    <div className={styles.root}>
      <div className={styles.streamInfo}>
        <Image
          alt={songTitle}
          width={96}
          height={54}
          src={`https://i.ytimg.com/vi/${videoId}/default.jpg`}
          objectFit="cover"
        />
        <div className={styles.meta}>
          <div className={styles.songTitle}>{songTitle}</div>
          <div className={styles.songArtist}>{songArtist}</div>
          <div className={styles.publishedAt}>{format(new Date(publishedAt), 'yyyy/MM/dd')}</div>
        </div>
      </div>
      <div className={styles.slider}>
        <Slider value={currentTime} max={length} onScrub={onSeek} />
        <div className={styles.lengths}>
          <span>{formatVideoLength(currentTime)}</span>
          <span>{formatVideoLength(length)}</span>
        </div>
      </div>
      <div className={styles.controls}>
        <div />
        <div className={styles.play}>
          {isPlaying ? (
            <IconButton size="large" aria-label="停止" onClick={onPause}>
              <MdPause />
            </IconButton>
          ) : (
            <IconButton size="large" aria-label="再生" onClick={onPlay}>
              <MdPlayArrow />
            </IconButton>
          )}
        </div>
        <div className={styles.repeat}>
          <IconButton aria-label={isRepeat ? 'リピートをやめる' : 'リピートする'} onClick={onRepeatClick}>
            <MdRepeatOne color={isRepeat ? '#ffffff' : '#757575'} />
          </IconButton>
        </div>
      </div>
    </div>
  );
});
