import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { DeleteVideoApiRequest } from '../../../pages/api/videos/[id]';

type Props = {
  mutate: KeyedMutator<Video[]>;
};

export function useDeleteVideoApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: DeleteVideoApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetch(`/api/videos/${request.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      mutate((data) => (data ? data.filter((video) => video.id !== request.id) : []));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
