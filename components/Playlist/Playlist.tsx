import clsx from 'clsx';
import { useRouter } from 'next/router';
import { memo, useCallback, useMemo } from 'react';
import type { SingingStreamForSearch } from '../../types';
import styles from './Playlist.module.scss';
import { PlaylistItem } from './PlaylistItem/PlaylistItem';

type Props = {
  className?: string;
  streams: SingingStreamForSearch[];
};

export const Playlist = memo(({ className, streams }: Props) => {
  const router = useRouter();

  const currentStreamId = useMemo(() => {
    const id = router.query.v;
    if (typeof id !== 'string') return '';
    return streams.find((stream) => stream.id === id)?.id || '';
  }, [router, streams]);

  return (
    <div className={clsx(styles.root, className)}>
      {streams.map((stream) => (
        <PlaylistItem stream={stream} isPlaying={stream.id === currentStreamId} key={stream.id} />
      ))}
    </div>
  );
});
