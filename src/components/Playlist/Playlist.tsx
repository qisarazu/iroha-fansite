import clsx from 'clsx';
import { Reorder } from 'framer-motion';
import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';

import type { SingingStreamWithVideoAndSong } from '../../types/SingingStream';
import styles from './Playlist.module.scss';
import { PlaylistItem } from './PlaylistItem/PlaylistItem';

type Props = {
  className?: string;
  streams: SingingStreamWithVideoAndSong[];
};

export const Playlist = memo(({ className, streams }: Props) => {
  const router = useRouter();

  const currentStreamId = useMemo(() => {
    const id = router.query.v;
    if (typeof id !== 'string') return '';
    return streams.find((stream) => stream.id === id)?.id || '';
  }, [router, streams]);

  const onReorder = () => {};

  return (
    <Reorder.Group className={clsx(styles.root, className)} axis="y" values={streams} onReorder={onReorder}>
      {streams.map((stream) => (
        <PlaylistItem stream={stream} isPlaying={stream.id === currentStreamId} key={stream.id} />
      ))}
    </Reorder.Group>
  );
});
