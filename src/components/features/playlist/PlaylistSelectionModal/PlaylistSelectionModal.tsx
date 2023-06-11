import { Stack } from '@mantine/core';
import { modals } from '@mantine/modals';
import type { SingingStream } from '@prisma/client';

import { usePlaylists } from '../../../../services/playlists/client';
import { Item } from './Item';

type Props = {
  musicId: SingingStream['id'];
};

export function PlaylistSelectionModal({ musicId }: Props) {
  const { playlists } = usePlaylists();

  function handleClose() {
    modals.closeAll();
  }

  return (
    <Stack spacing={0}>
      {playlists?.map((playlist) => (
        <Item playlist={playlist} musicId={musicId} onClick={handleClose} key={playlist.id} />
      ))}
    </Stack>
  );
}
