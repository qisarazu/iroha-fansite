import { ActionIcon, Box, Center, Group, Menu, Sx, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconBrandYoutube, IconDotsVertical, IconPlayerPlayFilled, IconTrash } from '@tabler/icons-react';
import { useT } from '@transifex/react';
import Image from 'next/image';
import Link from 'next/link';

import { useIsMobile } from '../../../../../hooks/ui/useIsMobile';
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
  const isMobile = useIsMobile();
  const { ref: hoverTarget, hovered } = useHover<HTMLAnchorElement>();

  const { deletePlaylistItem } = useDeletePlaylistItem(item.playlistId);

  function handleDelete() {
    deletePlaylistItem({
      itemId: item.id,
      playlistId: item.playlistId,
    });
  }

  return (
    <Group sx={{ ...sx, width: '100%' }} noWrap spacing="xs">
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
        <Image
          src={item.music.video.thumbnailMediumUrl}
          alt={item.music.song.title}
          width={isMobile ? 64 : 96}
          height={isMobile ? 36 : 54}
        />
      </Box>

      <Box
        sx={(theme) => ({
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 0.5fr',
          flexGrow: 1,
          alignItems: 'center',

          [theme.fn.smallerThan('sm')]: {
            gridTemplateColumns: '1fr 1fr 1fr 0.5fr',
          },
        })}
      >
        <Text
          fw="bold"
          lineClamp={isMobile ? 1 : 2}
          sx={(theme) => ({
            [theme.fn.smallerThan('sm')]: {
              gridColumn: 'span 3',
            },
          })}
        >
          {item.music.song.title}
        </Text>

        <Text
          lineClamp={isMobile ? 1 : 2}
          size={isMobile ? 'xs' : 'lg'}
          sx={(theme) => ({
            [theme.fn.smallerThan('sm')]: {
              gridColumn: 'span 2',
              gridRowStart: '2',
            },
          })}
        >
          {item.music.song.artist}
        </Text>

        <Text
          lineClamp={isMobile ? 1 : 2}
          size={isMobile ? 'xs' : 'lg'}
          sx={(theme) => ({
            [theme.fn.smallerThan('sm')]: {
              gridColumn: 'span 1',
              gridRowStart: '2',
            },
          })}
        >
          {item.music.video.title}
        </Text>

        <MusicLength
          start={item.music.start}
          end={item.music.end}
          size={isMobile ? 'xs' : 'lg'}
          sx={(theme) => ({
            justifySelf: 'flex-end',
            [theme.fn.smallerThan('sm')]: {
              alignSelf: 'center',
              gridRow: 'span 2',
              gridColumnStart: '4',
            },
          })}
        />
      </Box>
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
    </Group>
  );
}
