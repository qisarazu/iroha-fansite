import { modals } from '@mantine/modals';
import { useT } from '@transifex/react';
import { useCallback } from 'react';

import type { Playlist, PlaylistWithItem } from '../../../../services/playlists/type';
import { SortPlaylistItemModal } from './SortPlaylistItemModal';

export function useSortPlaylistItemModal() {
  const t = useT();

  const open = useCallback(
    (playlistId: Playlist['id']) => {
      modals.open({
        title: t('アイテムの並び替え'),
        children: <SortPlaylistItemModal playlistId={playlistId} />,
      });
    },
    [t],
  );

  return { open };
}
