import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';

import type { DeleteVideoApiRequest } from '../../../pages/api/videos/[id]';

export function useDeleteVideoApi() {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(async (request: DeleteVideoApiRequest): Promise<Video> => {
    setLoading(true);

    const data = await fetch(`/api/videos/${request.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

    setLoading(false);
    return data;
  }, []);

  return { delete: api, isLoading };
}
