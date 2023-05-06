import { ActionIcon, Box, Center, Group, Menu, Sx, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconBrandYoutube, IconDotsVertical, IconPlayerPlayFilled, IconTrash } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Image from 'next/image';
import Link from 'next/link';

import { useDeletePlaylistItem } from '../../../../../services/playlists/client';
import type { PlaylistItemWithMusic } from '../../../../../services/playlists/type';
import { getMusicWatchURL, getYouTubeURL } from '../../../../../utils/urls';
import { MusicLength } from '../../../../base/display/MusicLength/MusicLength';

type Props = {
  item: PlaylistItemWithMusic;
  sx?: Sx;
};

export function PlaylistItem({ item, sx }: Props) {
  const t = useT();
  const { ref: hoverTarget, hovered } = useHover<HTMLAnchorElement>();

  const { deletePlaylistItem } = useDeletePlaylistItem();

  function handleDelete() {
    deletePlaylistItem({
      itemId: item.id,
      playlistId: item.playlistId,
    });
  }

  return (
    <Group sx={{ ...sx, width: '100%' }} noWrap>
      <Box
        component={Link}
        href={getMusicWatchURL(item.musicId, { playlist: item.playlistId })}
        sx={{ position: 'relative', flexShrink: 0 }}
        ref={hoverTarget}
      >
        {hovered ? (
          <Center
            sx={(theme) => ({
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: theme.colors.dark,
              opacity: 0.5,
            })}
          >
            <IconPlayerPlayFilled />
          </Center>
        ) : null}
        <Image src={item.music.video.thumbnailMediumUrl} alt={item.music.song.title} width={96} height={54} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 0.5fr 0.5fr',
          flexGrow: 1,
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Text fw="bold" lineClamp={2}>
          {item.music.song.title}
        </Text>
        <Text lineClamp={2}>{item.music.song.artist}</Text>

        <Text lineClamp={2}>{item.music.video.title}</Text>

        <MusicLength start={item.music.start} end={item.music.end} />

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
            <Menu.Item
              icon={<IconBrandYoutube />}
              component="a"
              href={getYouTubeURL(item.music.video.videoId, item.music.start)}
              target="_blank"
              rel="noopener"
            >
              {t('YouTubeで見る')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Group>
  );
}
