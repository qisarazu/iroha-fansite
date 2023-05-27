import { ActionIcon, Box, Card, Flex, Menu, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconArrowsShuffle, IconDotsVertical, IconEdit, IconPlayerPlay, IconTrashFilled } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Link from 'next/link';
import { useMemo } from 'react';

import { useDeletePlaylist } from '../../../../services/playlists/client';
import type { Playlist } from '../../../../services/playlists/type';
import { getMusicWatchURL, getPlaylistURL } from '../../../../utils/urls';
import { useEditPlaylistModal } from '../EditPlaylistModal/useEditPlaylistModal';
import { PlaylistThumbnail } from './PlaylistThumbnail/PlaylistThumbnail';

type Props = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: Props) {
  const t = useT();
  const { ref, hovered: isThumbnailHover } = useHover();

  const { open } = useEditPlaylistModal();
  const { deletePlaylist } = useDeletePlaylist();

  const shuffleURL = useMemo(() => {
    if (!playlist) return '';

    const firstItemId = playlist.items[Math.floor(Math.random() * playlist.items.length)].musicId;
    return getMusicWatchURL(firstItemId, { playlist: playlist.id, shuffle: '1' });
  }, [playlist]);

  function handleDelete() {
    deletePlaylist({ id: playlist.id });
  }

  function handleEdit() {
    open(playlist);
  }

  function handlePlay() {
    console.log('play');
  }

  function handleShufflePlay() {
    console.log('shuffle');
  }

  return (
    <Box>
      <Card.Section sx={{ position: 'relative' }} ref={ref}>
        <Link href={getPlaylistURL(playlist.id)}>
          <PlaylistThumbnail thumbnailURLs={playlist.thumbnailURLs} alt={playlist.title} fill />
        </Link>
        <ActionIcon
          component={Link}
          href={getMusicWatchURL(playlist.items[0].musicId, { playlist: playlist.id })}
          variant="filled"
          radius="xl"
          size="xl"
          sx={(theme) => ({
            position: 'absolute',
            bottom: theme.spacing.xs,
            right: theme.spacing.xs,
            opacity: isThumbnailHover ? 0.75 : 0,
            ':hover': {
              opacity: 0.9,
            },
          })}
        >
          <IconPlayerPlay />
        </ActionIcon>
      </Card.Section>

      <Flex mt="xs" wrap="nowrap" justify="space-between">
        <Text
          component={Link}
          href={getPlaylistURL(playlist.id)}
          fw="bold"
          fz="lg"
          lineClamp={2}
          title={playlist.title}
          sx={{ ':hover': { textDecoration: 'underline' } }}
        >
          {playlist.title}
        </Text>

        <Menu position="bottom-end" shadow="sm" withinPortal>
          <Menu.Target>
            <ActionIcon>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconArrowsShuffle />} component={Link} href={shuffleURL}>
              {t('シャッフル再生')}
            </Menu.Item>
            <Menu.Item icon={<IconEdit />} onClick={handleEdit}>
              {t('編集')}
            </Menu.Item>
            <Menu.Item icon={<IconTrashFilled />} onClick={handleDelete}>
              {t('削除')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {playlist.description ? (
        <Text color="dimmed" lineClamp={3} title={playlist.description}>
          {playlist.description}
        </Text>
      ) : null}
    </Box>
  );
}
