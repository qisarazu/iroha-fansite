import { ActionIcon, Box, Group, Menu, Text } from '@mantine/core';
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
          <Image
            src={singingStream.video.thumbnailMediumUrl}
            width={256}
            height={144}
            alt={singingStream.video.title}
            style={{ objectFit: 'cover' }}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Text size="sm">{singingStream.song.artist}</Text>
          <Text size="lg" weight="bold">
            {singingStream.song.title}
          </Text>
          <Text size="sm" mt={48} lineClamp={1} title={singingStream.video.title}>
            {singingStream.video.title}
          </Text>
          <PublishedAt publishedAt={singingStream.video.publishedAt} size="sm" />
        </Box>
        <Menu>
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
