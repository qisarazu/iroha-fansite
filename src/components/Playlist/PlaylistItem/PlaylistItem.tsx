import { ActionIcon, Menu } from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';
import { IconBrandYoutube, IconDotsVertical, IconPlaylistAdd } from '@tabler/icons-react';
import { T, useT } from '@transifex/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Reorder } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';
import { MdPlayArrow, MdVolumeUp } from 'react-icons/md';

import { useHovering } from '../../../hooks/useHovering';
import type { Playlist } from '../../../services/playlists/type';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { getMusicWatchURL, getYouTubeURL } from '../../../utils/urls';
import { usePlaylistSelectionModal } from '../../features/playlist/PlaylistSelectionModal/usePlaylistSelectionModal';
import styles from './PlaylistItem.module.scss';

type Props = {
  className?: string;
  stream: SingingStreamWithVideoAndSong;
  playlistId?: Playlist['id'];
  isPlaying: boolean;
};

export const PlaylistItem = memo(({ className, stream, playlistId, isPlaying }: Props) => {
  const t = useT();
  const user = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const isHovering = useHovering(ref);

  const watchPath = getMusicWatchURL(stream.id, { playlist: playlistId });
  const { open } = usePlaylistSelectionModal();

  function handleAddPlaylistItem() {
    open(stream.id);
  }

  return (
    <Reorder.Item
      className={clsx(styles.item, className, { [styles.playing]: isPlaying })}
      value={stream}
      dragListener={false}
      ref={ref}
    >
      <Link className={styles.thumbnail} href={watchPath}>
        <Image
          alt={stream.song.title}
          src={stream.video.thumbnailDefaultUrl}
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
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
      </Link>
      <Link className={styles.info} href={watchPath}>
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
      </Link>

      <Menu>
        <Menu.Target>
          <ActionIcon sx={{ marginLeft: 'auto' }}>
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {user ? (
            <Menu.Item icon={<IconPlaylistAdd />} onClick={handleAddPlaylistItem}>
              {t('プレイリストに追加')}
            </Menu.Item>
          ) : null}
          <Menu.Item
            icon={<IconBrandYoutube />}
            component="a"
            href={getYouTubeURL(stream.video.videoId, stream.start)}
            target="_blank"
            rel="noopener"
          >
            {t('YouTubeで見る')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Reorder.Item>
  );
});
