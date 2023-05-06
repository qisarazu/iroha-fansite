import { Box, Button, Container, Group, Loader, SimpleGrid, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useT } from '@transifex/react';

import { useCreatePlaylistModal } from '../../components/features/playlist/CreatePlaylistModal/useCreatePlaylistModal';
import { PlaylistCard } from '../../components/features/playlist/PlaylistCard/PlaylistCard';
import { Layout } from '../../components/Layout/Layout';
import { usePlaylists } from '../../services/playlists/client';

export default function LibraryIndexPage() {
  const t = useT();

  const { playlists, isLoading } = usePlaylists();

  const { open } = useCreatePlaylistModal();

  return (
    <Layout title={t('プレイリスト一覧')}>
      <Container size="xl">
        <Group position="apart">
          <Title>{t('プレイリスト一覧')}</Title>
          <Button sx={{ marginLeft: 'auto' }} leftIcon={<IconPlus />} onClick={open}>
            {t('プレイリスト作成')}
          </Button>
        </Group>

        <Box sx={{ marginTop: 32 }}>
          {isLoading ? (
            <Loader />
          ) : !playlists ? (
            <div>{t('プレイリストがありません')}</div>
          ) : (
            <SimpleGrid
              breakpoints={[
                { minWidth: 'xs', cols: 1 },
                { minWidth: 'sm', cols: 3 },
                { minWidth: 'md', cols: 5 },
              ]}
            >
              {playlists.map((playlist) => (
                <PlaylistCard playlist={playlist} key={playlist.id} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>
    </Layout>
  );
}
