import { modals } from '@mantine/modals';
import type { Playlist } from '@prisma/client';
import { useT } from '@transifex/react';
import { useCallback } from 'react';

import { EditPlaylistModal } from './EditPlaylistModal';

export function useEditPlaylistModal() {
  const t = useT();

  const open = useCallback(
    (playlist: Playlist) => {
      modals.open({
        title: t('プレイリスト編集'),
        children: <EditPlaylistModal playlist={playlist} />,
      });
    },
    [t],
  );

  return { open };
}
