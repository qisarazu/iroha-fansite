import { format } from 'date-fns';
import Image from 'next/image';
import { memo, useCallback } from 'react';
import type { SingingStreamForSearch } from '../../types';
import styles from './Playlist.module.scss';

type Props = {
  streams: SingingStreamForSearch[];
  onItemClick: (stream: SingingStreamForSearch) => void;
};

export const Playlist = memo(({ streams, onItemClick }: Props) => {
  const onClick = useCallback(
    (stream: SingingStreamForSearch) => () => {
      onItemClick(stream);
    },
    [onItemClick],
  );

  return (
    <div className={styles.root}>
      {streams.map((stream) => (
        <div className={styles.item} key={stream.id} onClick={onClick(stream)}>
          <Image
            alt={stream.song.title}
            width={64}
            height={36}
            src={`https://i.ytimg.com/vi/${stream.video_id}/hqdefault.jpg`}
            objectFit="cover"
          />
          <div className={styles.info}>
            <span className={styles.songTitle}>{stream.song.title}</span>/<span>{stream.song.artist}</span>/
            <span>{format(new Date(stream.published_at), 'yyyy/MM/dd')}配信</span>
          </div>
        </div>
      ))}
    </div>
  );
});
