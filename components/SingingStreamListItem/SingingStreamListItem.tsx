import Image from 'next/image';
import Link from 'next/link';
import { SingingStream } from '../../types';
import styles from './SingingStreamListItem.module.scss';

type Props = {
  video: SingingStream;
};

export function SingingStreamListItem({ video }: Props) {
  return (
    <article className={styles.root}>
      <Link href={`/singing-streams/${video.id}`}>
        <a className={styles.thumbnail}>
          <Image
            src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
            alt={video.title}
            layout="fill"
            objectFit='cover'
          />
        </a>
      </Link>
      <div className={styles.info}>
        <Link href={`/singing-streams/watch/${video.id}`}>
          <a>
            <div className={styles.song}>
              <h2 className={styles.songTitle}>{video.song_title}</h2>
              <span className={styles.songArtist}>{video.song_artist}</span>
            </div>
            <span className={styles.videoTitle}>{video.title}</span>
          </a>
        </Link>
        <a
          className={styles.originalLink}
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          元動画を見る
        </a>
      </div>
    </article>
  );
}
