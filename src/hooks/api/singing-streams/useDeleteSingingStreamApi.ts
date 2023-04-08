import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { DeleteSingingStream } from '../../../pages/api/singing-streams/[id]';
import type { CursorResponse } from '../../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<CursorResponse<SingingStreamWithVideoAndSong[]>[]>;
};

export function useDeleteSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: DeleteSingingStream): Promise<void> => {
      setLoading(true);

      await fetcher(`/api/singing-streams/${request.id}`, 'delete');

      mutate();
      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
