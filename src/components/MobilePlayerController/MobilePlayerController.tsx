import { T, useT } from '@transifex/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo } from 'react';
import { MdShuffle, MdSkipNext, MdSkipPrevious } from 'react-icons/md';

import { formatVideoLength } from '../../utils/formatVideoLength';
import { IconButton } from '../IconButton/IconButton';
import { PlayButton } from '../PlayButton/PlayButton';
import { RepeatButton, RepeatType } from '../RepeatButton/RepeatButton';
import { Slider } from '../Slider/Slider';
import styles from './MobilePlayerController.module.scss';

type Props = {
  isPlaying: boolean;
  isShuffled: boolean;
  isSkipPrevDisabled: boolean;
  isSkipNextDisabled: boolean;
  needNativePlayPush: boolean;
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
  needNativePlayPush,
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
  const t = useT();
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
          <div className={styles.publishedAt}>
            <T
              _str="{date} 配信"
              _comment={
                'The text that indicates when a source video is streamed. Used in the player, playlists, and search result.\n\ndate: yyyy/MM/dd (e.g. "2022/02/18")'
              }
              date={format(new Date(publishedAt), 'yyyy/MM/dd')}
            />
          </div>
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
          <div className={styles.play}>
            <PlayButton
              needNativePlayPush={needNativePlayPush}
              isPlaying={isPlaying}
              onPlay={onPlay}
              onPause={onPause}
            />
          </div>
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
        </div>
        <div className={styles.rightControls}>
          <RepeatButton type={repeatType} onClick={onRepeat} />
        </div>
      </div>
    </div>
  );
});
