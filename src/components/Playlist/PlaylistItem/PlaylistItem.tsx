import { T } from '@transifex/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Reorder } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo, useRef } from 'react';
import { MdPlayArrow, MdVolumeUp } from 'react-icons/md';

import { useHovering } from '../../../hooks/useHovering';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { ExternalLink } from '../../ExternalLink/ExternalLink';
import { KebabMenu } from '../../KebabMenu/KebabMenu';
import styles from './PlaylistItem.module.scss';

type Props = {
  className?: string;
  stream: SingingStreamWithVideoAndSong;
  isPlaying: boolean;
};

export const PlaylistItem = memo(({ className, stream, isPlaying }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHovering(ref);

  const watchPath = useMemo(() => `/singing-streams/watch/${stream.id}`, [stream.id]);
  const youtubeUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${stream.video.videoId}&t=${stream.start}`,
    [stream.start, stream.video.videoId],
  );

  return (
    <Reorder.Item
      className={clsx(styles.item, className, { [styles.playing]: isPlaying })}
      value={stream}
      dragListener={false}
      ref={ref}
    >
      <Link href={watchPath}>
        <a className={styles.thumbnail}>
          <Image alt={stream.song.title} layout="fill" src={stream.video.thumbnailDefaultUrl} objectFit="cover" />
          {isHovering && !isPlaying ? (
            <div className={styles.hoveringIcon}>
              <MdPlayArrow />
            </div>
          ) : null}
          {isPlaying ? (
            <div className={styles.playingIcon}>
              <MdVolumeUp />
            </div>
          ) : null}
        </a>
      </Link>
      <Link href={watchPath}>
        <a className={styles.info}>
          <h2 className={styles.songTitle}>{stream.song.title}</h2>
          <span className={styles.songArtist}>
            {stream.song.artist} /{' '}
            <T
              _str="{date} 配信"
              _comment={
                'The text that indicates when a source video is streamed. Used in the player, playlists, and search result.\n\ndate: yyyy-MM-dd (e.g. "2022-02-18")'
              }
              date={format(new Date(stream.video.publishedAt), 'yyyy-MM-dd')}
            />
          </span>
        </a>
      </Link>
      <KebabMenu buttonClassName={styles.menu} size="small" placement="bottom-end">
        <ExternalLink className={styles.originalLink} href={youtubeUrl}>
          <T _str="YouTubeで見る" />
        </ExternalLink>
      </KebabMenu>
    </Reorder.Item>
  );
});
