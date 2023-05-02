import { modals } from '@mantine/modals';
import { useT } from '@transifex/react';
import { useCallback } from 'react';

import { CreatePlaylistModal } from './CreatePlaylistModal';

export function useCreatePlaylistModal() {
  const t = useT();

  const open = useCallback(() => {
    modals.open({
      title: t('新しいプレイリスト'),
      children: <CreatePlaylistModal />,
    });
  }, [t]);

  return { open };
}
