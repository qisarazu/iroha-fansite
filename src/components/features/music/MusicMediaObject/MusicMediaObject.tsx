import { ActionIcon, Box, Group, Menu, Stack, Text } from '@mantine/core';
import { IconBrandYoutube, IconPlaylistAdd } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { MdMoreVert } from 'react-icons/md';

import { useYouTubeUrl } from '../../../../hooks/useYouTubeUrl';
import type { SingingStreamWithVideoAndSong } from '../../../../types/SingingStream';
import { getMusicWatchURL } from '../../../../utils/urls';
import { PublishedAt } from '../../../base/display/PublishedAt/PublishedAt';
import { usePlaylistSelectionModal } from '../../playlist/PlaylistSelectionModal/usePlaylistSelectionModal';

type Props = {
  singingStream: SingingStreamWithVideoAndSong;
};

export function MusicMediaObject({ singingStream }: Props) {
  const t = useT();
  const watchUrl = useMemo(() => getMusicWatchURL(singingStream.id), [singingStream.id]);
  const youtubeUrl = useYouTubeUrl(singingStream.video.videoId, singingStream.start);
  const { open } = usePlaylistSelectionModal();

  function handlePlaylistSelectionModalOpen() {
    open(singingStream.id);
  }

  return (
    <div>
      <Group noWrap>
        <Link href={watchUrl}>
          <Box w={{ base: 128, lg: 256 }} h={{ base: 72, lg: 144 }} pos="relative">
            <Image
              src={singingStream.video.thumbnailMediumUrl}
              alt={singingStream.video.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </Box>
        </Link>
        <Stack sx={{ flexGrow: 1, alignSelf: 'stretch' }} spacing={0}>
          <Box component={Link} href={watchUrl} sx={{ ':hover': { textDecoration: 'underline' } }}>
            <Text fz={{ base: 'xs', md: 'sm' }}>{singingStream.song.artist}</Text>
            <Text component="h2" fz={{ base: 'sm', md: 'xl' }} weight="bold" lineClamp={1}>
              {singingStream.song.title}
            </Text>
          </Box>
          <Text mt="auto" fz={{ base: 'xs', md: 'sm' }} lineClamp={1} title={singingStream.video.title} color="dimmed">
            {singingStream.video.title}
          </Text>
          <PublishedAt
            color="dimmed"
            fz={{ base: 'xs', md: 'sm' }}
            publishedAt={singingStream.video.publishedAt}
            live
          />
        </Stack>
        <Menu position="bottom-end">
          <Menu.Target>
            <ActionIcon size="lg" sx={{ alignSelf: 'flex-start' }}>
              <MdMoreVert size={24} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<IconPlaylistAdd />} onClick={handlePlaylistSelectionModalOpen}>
              {t('プレイリストに追加')}
            </Menu.Item>
            <Menu.Item component="a" href={youtubeUrl} target="_blank" rel="noopener" icon={<IconBrandYoutube />}>
              {t('YouTube で見る')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
}
