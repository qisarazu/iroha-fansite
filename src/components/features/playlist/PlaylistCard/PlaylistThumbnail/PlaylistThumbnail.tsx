import { Box, Center, SimpleGrid } from '@mantine/core';
import type { Playlist } from '@prisma/client';
import { IconPlaylist } from '@tabler/icons-react';
import Image from 'next/image';

type Props = {
  thumbnailURLs: Playlist['thumbnailURLs'];
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function PlaylistThumbnail({ thumbnailURLs, alt, width, height, fill = false }: Props) {
  const cols = thumbnailURLs.length === 4 ? 2 : 1;

  if (!thumbnailURLs.length) {
    return (
      <Center sx={{ aspectRatio: '16/9', borderRadius: 4 }} w={width} h={height} bg="gray">
        <IconPlaylist />
      </Center>
    );
  }

  return (
    <SimpleGrid cols={cols} spacing={0} sx={{ aspectRatio: '16/9', borderRadius: 4 }} w={width} h={height}>
      {thumbnailURLs.map((url) => (
        <Box
          sx={{ position: 'relative' }}
          w={width ? width / cols : '100%'}
          h={height ? height / cols : '100%'}
          key={url}
        >
          <Image
            src={url}
            alt={alt}
            width={width ? width / cols : undefined}
            height={height ? height / cols : undefined}
            fill={fill}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}
