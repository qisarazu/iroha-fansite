import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutSongApiRequest } from '../../../pages/api/songs/[id]';

type Props = {
  mutate: KeyedMutator<Song[]>;
};

export function usePutSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutSongApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetch(`/api/songs/${request.id}`, {
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
