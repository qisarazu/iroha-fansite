import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PostVideoApiRequest } from '../../../pages/api/videos';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<ApiResponse<Video[]>>;
};

export function usePostVideoApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostVideoApiRequest): Promise<void> => {
      setLoading(true);

      await fetcher('/api/videos', 'post', request);

      mutate();

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
