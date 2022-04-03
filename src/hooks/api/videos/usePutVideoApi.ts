import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';

import type { PutVideoApiRequest } from '../../../pages/api/videos/[id]';

export function usePutVideoApi() {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(async (request: PutVideoApiRequest): Promise<Video> => {
    setLoading(true);

    const data = await fetch(`/api/videos/${request.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }).then((res) => res.json());

    setLoading(false);
    return data;
  }, []);

  return { put: api, isLoading };
}
