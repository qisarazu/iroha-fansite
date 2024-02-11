import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionIcon, Box, Center, CSSProperties, Group, Menu, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconBrandYoutube, IconDotsVertical, IconPlayerPlayFilled, IconTrash } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Image from 'next/image';
import Link from 'next/link';

import { useIsMobile } from '../../../../../hooks/ui/useIsMobile';
import { useDeletePlaylistItem } from '../../../../../services/playlists/client';
import type { PlaylistItemWithMusic } from '../../../../../services/playlists/type';
import { getMusicWatchURL, getYouTubeURL } from '../../../../../utils/urls';
import { MusicLength } from '../../../../base/display/MusicLength/MusicLength';
import styles from './PlaylistItem.module.css';

type Props = {
  item: PlaylistItemWithMusic;
  sortable?: boolean;
  sx?: CSSProperties;
};

export function PlaylistItem({ item, sortable = false, sx }: Props) {
  const t = useT();
  const isMobile = useIsMobile();
  const { ref: hoverTarget, hovered } = useHover<HTMLAnchorElement>();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const clickDisabled = isMobile && sortable;

  const { deletePlaylistItem } = useDeletePlaylistItem(item.playlistId);

  function handleDelete() {
    deletePlaylistItem({
      itemId: item.id,
    });
  }

  return (
    <Group
      style={(theme) => ({
        ...sx,
        width: '100%',
        backgroundColor: theme.colors.dark[7],
        transition,
        transform: CSS.Transform.toString(transform),
      })}
      wrap="nowrap"
      gap="xs"
      ref={setNodeRef}
      {...attributes}
    >
      {/* サムネイル */}
      <Box
        component={Link}
        href={getMusicWatchURL(item.musicId, { playlist: item.playlistId })}
        style={{ position: 'relative', flexShrink: 0, pointerEvents: clickDisabled ? 'none' : 'initial' }}
        ref={hoverTarget}
      >
        {hovered ? (
          <Center
            style={(theme) => ({
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: theme.colors.dark,
              opacity: 0.5,
            })}
          >
            <IconPlayerPlayFilled />
          </Center>
        ) : null}
        <Image
          src={item.music.video.thumbnailMediumUrl}
          alt={item.music.song.title}
          width={isMobile ? 64 : 96}
          height={isMobile ? 36 : 54}
        />
      </Box>

      {/* 曲情報 */}
      <Box className={styles.meta} {...listeners}>
        <Text fw="bold" lineClamp={isMobile ? 1 : 2} className={styles.songTitle}>
          {item.music.song.title}
        </Text>

        <Text lineClamp={isMobile ? 1 : 2} size={isMobile ? 'xs' : 'lg'} className={styles.songArtist}>
          {item.music.song.artist}
        </Text>

        <Text lineClamp={isMobile ? 1 : 2} size={isMobile ? 'xs' : 'lg'} className={styles.videoTitle}>
          {item.music.video.title}
        </Text>

        <MusicLength
          start={item.music.start}
          end={item.music.end}
          size={isMobile ? 'xs' : 'lg'}
          className={styles.videoLength}
        />
      </Box>

      {/* メニュー */}
      {!clickDisabled ? (
        <Menu>
          <Menu.Target>
            <ActionIcon color="white" variant="subtle">
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconTrash />} onClick={handleDelete}>
              {t('削除')}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconBrandYoutube />}
              component="a"
              href={getYouTubeURL(item.music.video.videoId, item.music.start)}
              target="_blank"
              rel="noopener"
            >
              {t('YouTubeで見る')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : null}
    </Group>
  );
}
