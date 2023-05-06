import { ActionIcon, Box, Card, Flex, Menu, Text } from '@mantine/core';
import type { Playlist } from '@prisma/client';
import { IconArrowsShuffle, IconDotsVertical, IconEdit, IconTrashFilled } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import { useDeletePlaylist } from '../../../../services/playlists/client';
import { getPlaylistURL } from '../../../../utils/urls';
import { useEditPlaylistModal } from '../EditPlaylistModal/useEditPlaylistModal';
import { PlaylistThumbnail } from './PlaylistThumbnail/PlaylistThumbnail';

type Props = {
  playlist: Playlist;
};

export function PlaylistCard({ playlist }: Props) {
  const t = useT();

  const { open } = useEditPlaylistModal();
  const { deletePlaylist } = useDeletePlaylist();

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
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

  function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  return (
    <Box>
      <Card.Section component={Link} href={getPlaylistURL(playlist.id)}>
        <PlaylistThumbnail thumbnailURLs={playlist.thumbnailURLs} alt={playlist.title} fill />
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
            <Menu.Item icon={<IconArrowsShuffle />} onClick={handleShufflePlay}>
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
