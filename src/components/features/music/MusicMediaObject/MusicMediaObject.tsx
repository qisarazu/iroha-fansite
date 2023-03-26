import { ActionIcon, Box, Group, Menu, Stack, Text } from '@mantine/core';
import { useT } from '@transifex/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaYoutube } from 'react-icons/fa';
import { MdMoreVert } from 'react-icons/md';

import { useWatchUrl } from '../../../../hooks/useWatchUrl';
import { useYouTubeUrl } from '../../../../hooks/useYouTubeUrl';
import type { SingingStreamWithVideoAndSong } from '../../../../types/SingingStream';
import { PublishedAt } from '../../../base/display/PublishedAt/PublishedAt';

type Props = {
  singingStream: SingingStreamWithVideoAndSong;
};

export function MusicMediaObject({ singingStream }: Props) {
  const t = useT();
  const watchUrl = useWatchUrl(singingStream.id);
  const youtubeUrl = useYouTubeUrl(singingStream.video.videoId, singingStream.start);

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
            <Menu.Item component="a" href={youtubeUrl} target="_blank" rel="noopener" icon={<FaYoutube />}>
              {t('YouTube で見る')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
}
