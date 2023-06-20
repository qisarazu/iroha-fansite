import { Accordion, Box, Button, Container, Group, List, Loader, SimpleGrid, Text, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useUser } from '@supabase/auth-helpers-react';
import { IconAlertTriangle, IconPlus } from '@tabler/icons-react';
import { useT } from '@transifex/react';

import { useCreatePlaylistModal } from '../../components/features/playlist/CreatePlaylistModal/useCreatePlaylistModal';
import { PlaylistCard } from '../../components/features/playlist/PlaylistCard/PlaylistCard';
import { Layout } from '../../components/Layout/Layout';
import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { usePlaylists } from '../../services/playlists/client';

export default function LibraryIndexPage() {
  const t = useT();
  const user = useUser();
  const isMobile = useIsMobile();

  const [defaultOpened, setDefaultOpened] = useLocalStorage<string | null>({
    key: 'playlist-caution-opened',
    defaultValue: 'caution',
  });

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

        {!user ? (
          <Accordion value={defaultOpened} onChange={setDefaultOpened} mt="xs">
            <Accordion.Item value="caution">
              <Accordion.Control icon={<IconAlertTriangle color="red" />}>
                <Text fw="bold" color="red">
                  {t('ログインせず利用する際の注意点')}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                {t('プレイリスト機能はログインしていなくてもご利用いただけますが、以下の点にご注意ください')}
                <List mt="xs" withPadding={!isMobile}>
                  <List.Item>
                    {t(
                      'データはブラウザのローカルストレージに保存されるため、キャッシュクリアなどを行うとプレイリストも削除されます。',
                    )}
                  </List.Item>
                  <List.Item>
                    {t('異なるブラウザ、デバイス間 (PC ↔ スマホなど) でデータの共有はされません。')}
                  </List.Item>
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ) : null}

        <Box sx={{ marginTop: 32 }}>
          {isLoading ? (
            <Loader />
          ) : !playlists ? (
            <div>
              <Text>{t('プレイリストがありません。')}</Text>
              <Text>{!user ? t('プレイリストを作成するにはログインしてください。') : null}</Text>
            </div>
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
