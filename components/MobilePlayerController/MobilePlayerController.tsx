import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo } from 'react';
import { MdPause, MdPlayArrow, MdShuffle, MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { formatVideoLength } from '../../utils/formatVideoLength';
import { IconButton } from '../IconButton/IconButton';
import { RepeatButton, RepeatType } from '../RepeatButton/RepeatButton';
import { Slider } from '../Slider/Slider';
import styles from './MobilePlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isShuffled: boolean;
  isSkipPrevDisabled: boolean;
  isSkipNextDisabled: boolean;
  repeatType: RepeatType;
  currentTime: number;
  length: number;
  videoId: string;
  songTitle: string;
  songArtist: string;
  publishedAt: string;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onRepeat: (type: RepeatType) => void;
  onShuffle: () => void;
  onSkipPrev: () => void;
  onSkipNext: () => void;
};

export const MobilePlayerController = memo(function MobilePlayerController({
  isPlaying,
  isShuffled,
  isSkipPrevDisabled,
  isSkipNextDisabled,
  repeatType,
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
  onShuffle,
  onSkipPrev,
  onSkipNext,
}: Props) {
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
          <div className={styles.publishedAt}>{format(new Date(publishedAt), 'yyyy/MM/dd')} 配信</div>
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
        <div className={styles.leftControls}>
          <IconButton className={clsx(styles.shuffle, { [styles['shuffled']]: isShuffled })} onClick={onShuffle}>
            <MdShuffle />
          </IconButton>
        </div>
        <div className={styles.middleControls}>
          <IconButton aria-label="前の曲" onClick={onSkipPrev} disabled={isSkipPrevDisabled}>
            <MdSkipPrevious />
          </IconButton>
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
          <IconButton aria-label="次の曲" onClick={onSkipNext} disabled={isSkipNextDisabled}>
            <MdSkipNext />
          </IconButton>
        </div>
        <div className={styles.rightControls}>
          <RepeatButton type={repeatType} onClick={onRepeat} />
        </div>
      </div>
    </div>
  );
});
