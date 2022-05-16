import { Box, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo } from 'react';

import type { SingingStreamWithVideoAndSong } from '../../../../types/SingingStream';

type Props = {
  singingStream: SingingStreamWithVideoAndSong;
};

export const SingingStreamMediaObject = memo(({ singingStream }: Props) => {
  return (
    <Stack direction="row" spacing={1} sx={{ overflow: 'hidden' }}>
      <Image
        src={singingStream.video.thumbnailDefaultUrl}
        alt={singingStream.video.title}
        width={96}
        height={54}
        objectFit="cover"
      />
      <Box>
        <Stack direction="row" alignItems="baseline" spacing={1}>
          <Typography variant="subtitle1">{singingStream.song.title}</Typography>
          <Typography variant="subtitle2">/ {singingStream.song.artist}</Typography>
        </Stack>
        <Typography variant="body2">{format(new Date(singingStream.video.publishedAt), 'yyyy/MM/dd HH:mm')}</Typography>
      </Box>
    </Stack>
  );
});
