import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutSongApiRequest } from '../../../pages/api/songs/[id]';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<ApiResponse<Song[]>>;
};

export function usePutSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutSongApiRequest): Promise<Song | undefined> => {
      setLoading(true);

      const { data } = await fetcher<ApiResponse<Song>>(`/api/songs/${request.id}`, 'put', request);

      mutate();
      setLoading(false);

      return data;
    },
    [mutate],
  );

  return { api, isLoading };
}
