import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PostVideoApiRequest } from '../../../pages/api/videos';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<Video[]>;
};

export function usePostVideoApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostVideoApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetcher<Video>('/api/videos', 'post', request);

      mutate((data) => (data ? [...data, newData] : [newData]));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
