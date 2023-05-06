import { modals } from '@mantine/modals';
import type { SingingStream } from '@prisma/client';
import { useT } from '@transifex/react';
import { useCallback } from 'react';

import { PlaylistSelectionModal } from './PlaylistSelectionModal';

export function usePlaylistSelectionModal() {
  const t = useT();

  const open = useCallback(
    (itemId: SingingStream['id']) => {
      modals.open({
        title: t('プレイリストに追加'),
        children: <PlaylistSelectionModal itemId={itemId} />,
      });
    },
    [t],
  );

  return { open };
}
