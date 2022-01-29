import Image from 'next/image';
import Link from 'next/link';
import type { SingingStreamForSearch } from '../../types';
import { KebabMenu } from '../KebabMenu/KebabMenu';
import { format } from 'date-fns';
import styles from './SingingStreamMediaObject.module.scss';

type Props = {
  singingStream: SingingStreamForSearch;
};

export function SingingStreamMediaObject({ singingStream }: Props) {
  return (
    <article className={styles.root}>
      <Link href={`/singing-streams/watch/${singingStream.id}`}>
        <a className={styles.thumbnail}>
          <Image
            src={`https://i.ytimg.com/vi/${singingStream.video_id}/hqdefault.jpg`}
            alt={singingStream.video.title}
            layout="fill"
            objectFit="cover"
          />
        </a>
      </Link>
      <div className={styles.info}>
        <Link href={`/singing-streams/watch/${singingStream.id}`}>
          <a>
            <div className={styles.song}>
              <h2 className={styles.songTitle}>{singingStream.song.title}</h2>
              <span className={styles.songArtist}>{singingStream.song.artist}</span>
            </div>
            <span className={styles.videoTitle}>{singingStream.video.title}</span>
          </a>
        </Link>
        <span className={styles.publishedAt}>{format(new Date(singingStream.published_at), 'yyyy/MM/dd')}</span>
      </div>
      <KebabMenu buttonClassName={styles.menu} placement="bottom-end">
        <a
          className={styles.originalLink}
          href={`${singingStream.video.url}&t=${singingStream.start}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          元動画を見る
        </a>
      </KebabMenu>
    </article>
  );
}
