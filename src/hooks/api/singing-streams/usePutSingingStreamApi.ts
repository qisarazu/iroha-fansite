import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutSingingStreamRequest } from '../../../pages/api/singing-streams/[id]';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<SingingStreamWithVideoAndSong[]>;
};

export function usePutSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutSingingStreamRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetcher<SingingStreamWithVideoAndSong>(
        `/api/singing-streams/${request.id}`,
        'put',
        request,
      );

      mutate((data) => (data ? data.map((song) => (song.id === newData.id ? newData : song)) : [newData]));
      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
