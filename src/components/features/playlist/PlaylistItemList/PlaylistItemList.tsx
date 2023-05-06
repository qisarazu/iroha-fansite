import { Box, Divider, Sx } from '@mantine/core';

import type { PlaylistItemWithMusic } from '../../../../services/playlists/type';
import { PlaylistItem } from './PlaylistItem/PlaylistItem';

type Props = {
  items: PlaylistItemWithMusic[];
  sx?: Sx;
};

export function PlaylistItemList({ items, sx }: Props) {
  return (
    <Box sx={sx}>
      {items.map((item, i) => (
        <>
          {i !== 0 ? <Divider sx={{ marginTop: 8, marginBottom: 8 }} /> : null}
          <PlaylistItem item={item} key={item.id} />
        </>
      ))}
    </Box>
  );
}
