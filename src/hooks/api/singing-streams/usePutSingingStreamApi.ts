import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { SingingStreamWithVideoAndSong } from '../../../model';
import type { PutSingingStreamRequest } from '../../../pages/api/singing-streams/[id]';

type Props = {
  mutate: KeyedMutator<SingingStreamWithVideoAndSong[]>;
};

export function usePutSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutSingingStreamRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetch(`/api/singing-streams/${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }).then((res) => res.json());

      mutate((data) => (data ? data.map((song) => (song.id === newData.id ? newData : song)) : [newData]));
      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
