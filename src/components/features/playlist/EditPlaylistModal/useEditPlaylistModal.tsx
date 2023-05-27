import { modals } from '@mantine/modals';
import { useT } from '@transifex/react';
import { useCallback } from 'react';

import type { Playlist } from '../../../../services/playlists/type';
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
