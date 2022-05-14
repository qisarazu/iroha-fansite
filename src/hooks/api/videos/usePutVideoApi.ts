import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutVideoApiRequest } from '../../../pages/api/videos/[id]';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<Video[]>;
};
export function usePutVideoApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutVideoApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetcher<Video>(`/api/videos/${request.id}`, 'put', request);

      mutate((data) => (data ? data.map((video) => (video.id === newData.id ? newData : video)) : [newData]));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
