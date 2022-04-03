import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';

import type { PostVideosApiRequest } from '../../../pages/api/videos';

export function usePostVideoApi() {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(async (request: PostVideosApiRequest): Promise<Video> => {
    setLoading(true);

    const data = await fetch('/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }).then((res) => res.json());

    setLoading(false);
    return data;
  }, []);

  return { post: api, isLoading };
}
