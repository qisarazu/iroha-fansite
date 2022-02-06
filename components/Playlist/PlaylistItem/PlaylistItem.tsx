import clsx from 'clsx';
import { format } from 'date-fns';
import { Reorder } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';
import { MdPlayArrow, MdVolumeUp } from 'react-icons/md';
import { useHovering } from '../../../hooks/useHovering';
import type { SingingStreamForSearch } from '../../../types';
import { ExternalLink } from '../../ExternalLink/ExternalLink';
import { KebabMenu } from '../../KebabMenu/KebabMenu';
import styles from './PlaylistItem.module.scss';

type Props = {
  className?: string;
  stream: SingingStreamForSearch;
  isPlaying: boolean;
};

export const PlaylistItem = memo(({ className, stream, isPlaying }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHovering(ref);

  return (
    <Reorder.Item className={clsx(styles.item, className)} value={stream} dragListener={false} ref={ref}>
      <Link href={`/singing-streams/watch?v=${stream.id}`}>
        <a className={styles.thumbnail}>
          <Image
            alt={stream.song.title}
            layout="fill"
            src={`https://i.ytimg.com/vi/${stream.video_id}/default.jpg`}
            objectFit="cover"
          />
          {isHovering && !isPlaying ? (
            <div className={styles.hovering}>
              <MdPlayArrow />
            </div>
          ) : null}
          {isPlaying ? (
            <div className={styles.playing}>
              <MdVolumeUp />
            </div>
          ) : null}
        </a>
      </Link>
      <Link href={`/singing-streams/watch?v=${stream.id}`}>
        <a className={styles.info}>
          <h2 className={styles.songTitle}>{stream.song.title}</h2>
          <span className={styles.songArtist}>
            {stream.song.artist} / {format(new Date(stream.published_at), 'yyyy-MM-dd')} 配信
          </span>
        </a>
      </Link>
      <KebabMenu buttonClassName={styles.menu} size="small" placement="bottom-end">
        <ExternalLink className={styles.originalLink} href={`${stream.video.url}&t=${stream.start}`}>
          YouTubeで見る
        </ExternalLink>
      </KebabMenu>
    </Reorder.Item>
  );
});
