import { ActionIcon, Button, Container, Flex, Group, Menu, Stack, Text } from '@mantine/core';
import { IconArrowsShuffle, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { PlaylistThumbnail } from '../../components/features/playlist/PlaylistCard/PlaylistThumbnail/PlaylistThumbnail';
import { PlaylistItemList } from '../../components/features/playlist/PlaylistItemList/PlaylistItemList';
import { Layout } from '../../components/Layout/Layout';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { useAddPlaylistItem, useDeletePlaylist } from '../../services/playlists/client';
import { getPlaylistDetails } from '../../services/playlists/server';
import type { PlaylistWithItem } from '../../services/playlists/type';
import { getSession } from '../../services/session/server';
import { getMusicWatchURL, getPlaylistURL } from '../../utils/urls';

export const getServerSideProps: GetServerSideProps<{ playlist: string }> = async (context) => {
  const { id } = context.params as { id: string };

  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/library',
        permanent: false,
      },
    };
  }

  const playlist = await getPlaylistDetails(id, session.user.id);

  if (!playlist) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      playlist: JSON.stringify(playlist),
    },
  };
};

export default function PlaylistIdPage({ playlist: _p }: { playlist: string }) {
  const playlist = JSON.parse(_p) as PlaylistWithItem;
  const t = useT();
  const router = useRouter();
  const isMobile = useIsMobile();

  const { addPlaylistItem } = useAddPlaylistItem();
  const { deletePlaylist } = useDeletePlaylist();

  const thumbnailSize = { width: isMobile ? 160 : 320, height: isMobile ? 90 : 180 };

  function handleDelete() {
    deletePlaylist({ id: playlist.id });
    router.push(getPlaylistURL());
  }

  function handleAddItem() {
    addPlaylistItem({
      playlistId: playlist.id,
      musicId: '2e9bac2b-61b8-4b9a-8218-a9620879b7df',
    });
    addPlaylistItem({
      playlistId: playlist.id,
      musicId: '11119cfb-6d41-4590-bb78-387caf6eae61',
    });
    addPlaylistItem({
      playlistId: playlist.id,
      musicId: '38a7adfe-6597-4c6e-a007-695aa0253a71',
    });
    addPlaylistItem({
      playlistId: playlist.id,
      musicId: '8ede4295-8c26-49c4-8470-86acaaf4f132',
    });
  }

  return (
    <Layout title={playlist.title}>
      <Container size="xl">
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

        <section>
          <Button onClick={handleAddItem}>add</Button>

          <PlaylistItemList items={playlist.items} />
        </section>
      </Container>
    </Layout>
  );
}
