import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutVideoApiRequest } from '../../../pages/api/videos/[id]';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<ApiResponse<Video[]>>;
};
export function usePutVideoApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutVideoApiRequest): Promise<void> => {
      setLoading(true);

      await fetcher(`/api/videos/${request.id}`, 'put', request);

      mutate();

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
