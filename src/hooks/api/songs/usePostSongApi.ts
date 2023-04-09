import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PostSongApiRequest } from '../../../pages/api/songs';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<ApiResponse<Song[]>>;
};

export function usePostSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostSongApiRequest): Promise<void> => {
      setLoading(true);

      await fetcher('/api/songs', 'post', request);

      mutate();

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
