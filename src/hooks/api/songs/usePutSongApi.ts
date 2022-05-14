import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutSongApiRequest } from '../../../pages/api/songs/[id]';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<Song[]>;
};

export function usePutSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutSongApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetcher<Song>(`/api/songs/${request.id}`, 'put', request);

      mutate((data) => (data ? data.map((song) => (song.id === newData.id ? newData : song)) : [newData]));
      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
