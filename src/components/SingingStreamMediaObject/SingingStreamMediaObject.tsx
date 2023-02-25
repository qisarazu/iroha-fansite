import { T, useT } from '@transifex/react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useMemo } from 'react';

import { useIsMobile } from '../../hooks/useIsMobile';
import type { SingingStreamWithVideoAndSong } from '../../types/SingingStream';
import { ExternalLink } from '../ExternalLink/ExternalLink';
import { KebabMenu } from '../KebabMenu/KebabMenu';
import styles from './SingingStreamMediaObject.module.scss';

type Props = {
  singingStream: SingingStreamWithVideoAndSong;
};

export const SingingStreamMediaObject = memo(function SingingStreamMediaObject({ singingStream }: Props) {
  const isMobile = useIsMobile();
  const t = useT();

  const watchPath = useMemo(() => `/singing-streams/watch?v=${singingStream.id}`, [singingStream.id]);
  const youtubeUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${singingStream.video.videoId}&t=${singingStream.start}`,
    [singingStream.video.videoId, singingStream.start],
  );

  return (
    <article className={styles.root}>
      <Link className={styles.thumbnail} href={watchPath}>
        <Image
          src={singingStream.video.thumbnailMediumUrl}
          alt={singingStream.video.title}
          layout="fill"
          objectFit="cover"
        />
      </Link>
      <div className={styles.info}>
        <Link href={watchPath}>
          <div className={styles.song}>
            <h2 className={styles.songTitle}>{singingStream.song.title}</h2>
            <span className={styles.songArtist}>{singingStream.song.artist}</span>
          </div>
          <span className={styles.videoTitle}>{singingStream.video.title}</span>
        </Link>
        <span className={styles.publishedAt}>
          <T
            _str="{date} 配信"
            _comment={
              'The text that indicates when a source video is streamed. Used in the player, playlists, and search result.\n\ndate: yyyy/MM/dd (e.g. "2022/02/18")'
            }
            date={format(new Date(singingStream.video.publishedAt), 'yyyy/MM/dd')}
          />
        </span>
      </div>
      <KebabMenu
        buttonClassName={styles.menu}
        placement="bottom-end"
        aria-label={t('動画メニュー', {
          _context: 'aria-label',
          _comment: 'The aria-label applied to the button to kebab menu',
        })}
        size={isMobile ? 'small' : 'medium'}
      >
        <ExternalLink className={styles.originalLink} href={youtubeUrl}>
          <T _str="YouTubeで見る" />
        </ExternalLink>
      </KebabMenu>
    </article>
  );
});
