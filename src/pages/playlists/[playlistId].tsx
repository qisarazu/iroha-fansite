import { ActionIcon, Box, Button, Center, Container, Flex, Group, Loader, Menu, Stack, Text } from '@mantine/core';
import { IconArrowsShuffle, IconArrowsSort, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useEditPlaylistModal } from '../../components/features/playlist/EditPlaylistModal/useEditPlaylistModal';
import { PlaylistThumbnail } from '../../components/features/playlist/PlaylistCard/PlaylistThumbnail/PlaylistThumbnail';
import { PlaylistGuide } from '../../components/features/playlist/PlaylistGuide/PlaylistGuide';
import { PlaylistItemList } from '../../components/features/playlist/PlaylistItemList/PlaylistItemList';
import { useSortPlaylistItemModal } from '../../components/features/playlist/SortPlaylistItemModal/useSortPlaylistItemModal';
import { Layout } from '../../components/Layout/Layout';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useDeletePlaylist, usePlaylistDetails } from '../../services/playlists/client';
import { getPlaylistURL, getPlaylistWatchURL } from '../../utils/urls';
import styles from './[playlistId].module.css';

export default function PlaylistIdPage() {
  const t = useT();
  const router = useRouter();

  const { playlistId } = router.query as { playlistId: string };
  const { playlist, isLoading } = usePlaylistDetails(playlistId);
  const { deletePlaylist } = useDeletePlaylist();
  const { open } = useEditPlaylistModal();
  const { open: sortModalOpen } = useSortPlaylistItemModal();
  const isMobile = useIsMobile();

  function handleEdit() {
    if (!playlist) return;
    open(playlist);
  }

  function handleDelete() {
    if (!playlist) return;
    deletePlaylist({ id: playlist.id });
    router.push(getPlaylistURL());
  }

  function handleSort() {
    if (!playlist) return;

    sortModalOpen(playlist.id);
  }

  return (
    <Layout title={playlist?.title ?? ''}>
      <Container size="xl">
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : !playlist ? (
          'プレイリストがありません'
        ) : (
          <>
            <Flex className={styles.header}>
              <PlaylistThumbnail width={320} height={180} thumbnailURLs={playlist.thumbnailURLs} alt={playlist.title} />

              <Stack gap={0} style={{ width: '100%' }}>
                <Text component="h1" size="xl">
                  {playlist.title}
                </Text>
                <Text color="dimmed" mb="xs">
                  {playlist.description}
                </Text>

                <Group style={{ marginTop: 'auto' }}>
                  <Button
                    component={Link}
                    leftSection={<IconArrowsShuffle />}
                    radius="xl"
                    href={getPlaylistWatchURL(playlist, { shuffle: true })}
                  >
                    {t('シャッフル')}
                  </Button>
                  <Button leftSection={<IconEdit />} variant="outline" radius="xl" onClick={handleEdit}>
                    {t('編集')}
                  </Button>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      {isMobile ? (
                        <Menu.Item leftSection={<IconArrowsSort />} onClick={handleSort}>
                          {t('並び替え')}
                        </Menu.Item>
                      ) : null}
                      <Menu.Item leftSection={<IconTrash />} onClick={handleDelete}>
                        {t('削除')}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Stack>
            </Flex>

            <Box mt={{ base: 32, md: 64 }}>
              {playlist.items.length ? (
                <PlaylistItemList playlistId={playlist.id} items={playlist.items} sortable={!isMobile} />
              ) : (
                <div>
                  <p>プレイリストにアイテムがありません。</p>
                  <PlaylistGuide className={styles.playlistGuide} />
                </div>
              )}
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
}
