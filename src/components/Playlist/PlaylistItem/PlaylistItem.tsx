import { createStyles, Menu } from '@mantine/core';
import { T } from '@transifex/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Reorder } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { MdPlayArrow, MdVolumeUp } from 'react-icons/md';

import { useHovering } from '../../../hooks/useHovering';
import type { SingingStreamForSearch } from '../../../types';
import { ExternalLink } from '../../ExternalLink/ExternalLink';
import styles from './PlaylistItem.module.scss';

type Props = {
  className?: string;
  stream: SingingStreamForSearch;
  isPlaying: boolean;
};

const useStyles = createStyles((theme) => ({
  menu: {
    marginRight: theme.spacing.sm,
    marginLeft: 'auto',
  },
}));

export const PlaylistItem = memo(({ className, stream, isPlaying }: Props) => {
  const { classes } = useStyles();
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHovering(ref);

  return (
    <Reorder.Item
      className={clsx(styles.item, className, { [styles.playing]: isPlaying })}
      value={stream}
      dragListener={false}
      ref={ref}
    >
      <Link href={`/singing-streams/watch?v=${stream.id}`}>
        <a className={styles.thumbnail}>
          <Image
            alt={stream.song.title}
            layout="fill"
            src={`https://i.ytimg.com/vi/${stream.video_id}/default.jpg`}
            objectFit="cover"
          />
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
      <Link href={`/singing-streams/watch?v=${stream.id}`}>
        <a className={styles.info}>
          <h2 className={styles.songTitle}>{stream.song.title}</h2>
          <span className={styles.songArtist}>
            {stream.song.artist} /{' '}
            <T
              _str="{date} 配信"
              _comment={
                'The text that indicates when a source video is streamed. Used in the player, playlists, and search result.\n\ndate: yyyy-MM-dd (e.g. "2022-02-18")'
              }
              date={format(new Date(stream.published_at), 'yyyy-MM-dd')}
            />
          </span>
        </a>
      </Link>
      <Menu className={classes.menu} placement="end">
        <Menu.Item icon={<FaYoutube />}>
          <ExternalLink className={styles.originalLink} href={`${stream.video.url}&t=${stream.start}`}>
            <T _str="YouTubeで見る" />
          </ExternalLink>
        </Menu.Item>
      </Menu>
    </Reorder.Item>
  );
});
