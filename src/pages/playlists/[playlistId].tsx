import { ActionIcon, Box, Button, Center, Container, Flex, Group, Loader, Menu, Stack, Text } from '@mantine/core';
import { IconArrowsShuffle, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { PlaylistThumbnail } from '../../components/features/playlist/PlaylistCard/PlaylistThumbnail/PlaylistThumbnail';
import { PlaylistItemList } from '../../components/features/playlist/PlaylistItemList/PlaylistItemList';
import { Layout } from '../../components/Layout/Layout';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useDeletePlaylist, usePlaylistDetails } from '../../services/playlists/client';
import { getMusicWatchURL, getPlaylistURL } from '../../utils/urls';

export default function PlaylistIdPage() {
  const t = useT();
  const router = useRouter();
  const isMobile = useIsMobile();

  const { playlistId } = router.query as { playlistId: string };
  const { playlist, isLoading } = usePlaylistDetails(playlistId);
  const { deletePlaylist } = useDeletePlaylist();

  const thumbnailSize = { width: isMobile ? 160 : 320, height: isMobile ? 90 : 180 };

  function handleDelete() {
    if (!playlist) return;
    deletePlaylist({ id: playlist.id });
    router.push(getPlaylistURL());
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
            <Flex>
              <PlaylistThumbnail
                width={thumbnailSize.width}
                height={thumbnailSize.height}
                thumbnailURLs={playlist.thumbnailURLs}
                alt={playlist.title}
              />

              <Stack sx={{ marginLeft: 24 }} spacing={0}>
                <Text component="h1" fz="2rem">
                  {playlist.title}
                </Text>
                <Text color="dimmed">{playlist.description}</Text>

                <Group sx={{ marginTop: 'auto' }}>
                  <Button
                    component={Link}
                    leftIcon={<IconArrowsShuffle />}
                    radius="xl"
                    href={getMusicWatchURL(playlist.items[0]?.id ?? '', { playlist: playlist.id, shuffle: '1' })}
                  >
                    {t('シャッフル')}
                  </Button>
                  <Button leftIcon={<IconEdit />} variant="outline" radius="xl">
                    {t('編集')}
                  </Button>
                  <Menu>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item icon={<IconTrash />} onClick={handleDelete}>
                        {t('削除')}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Stack>
            </Flex>

            <Box mt={64}>
              <PlaylistItemList items={playlist.items} />
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
}
