import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutSingingStreamRequest } from '../../../pages/api/singing-streams/[id]';
import type { CursorResponse } from '../../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<CursorResponse<SingingStreamWithVideoAndSong[]>[]>;
};

export function usePutSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutSingingStreamRequest): Promise<SingingStreamWithVideoAndSong | undefined> => {
      setLoading(true);

      const { data } = await fetcher<CursorResponse<SingingStreamWithVideoAndSong>>(
        `/api/singing-streams/${request.id}`,
        'put',
        request,
      );

      mutate();
      setLoading(false);
      return data;
    },
    [mutate],
  );

  return { api, isLoading };
}
