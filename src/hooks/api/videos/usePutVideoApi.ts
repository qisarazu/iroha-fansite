import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PutVideoApiRequest } from '../../../pages/api/videos/[id]';

type Props = {
  mutate: KeyedMutator<Video[]>;
};
export function usePutVideoApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PutVideoApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetch(`/api/videos/${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }).then((res) => res.json());

      mutate((data) => (data ? data.map((video) => (video.id === newData.id ? newData : video)) : [newData]));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
