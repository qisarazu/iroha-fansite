import type { Video } from '@prisma/client';
import { useCallback, useState } from 'react';
import useSWRImmutable from 'swr/immutable';

import type { GetVideosApiRequest } from '../../../pages/api/videos';
import { fetcher } from '../../../utils/fetcher';

export function useGetVideosApi(props: GetVideosApiRequest = {}) {
  const [isLoading, setLoading] = useState(false);

  const createQuery = useCallback((props: GetVideosApiRequest) => {
    const searchParams = new URLSearchParams();
    props.orderBy && searchParams.append('orderBy', props.orderBy);
    props.orderDirection && searchParams.append('orderDirection', props.orderDirection);
    return searchParams.toString();
  }, []);

  const { data, mutate } = useSWRImmutable<Video[]>(
    `/api/videos${createQuery(props) ? '?' + createQuery(props) : ''}`,
    fetcher,
  );

  const api = useCallback(
    async (request: GetVideosApiRequest = {}): Promise<Video[]> => {
      setLoading(true);

      const data = await fetch(`/api/videos${createQuery(request) ? '?' + createQuery(request) : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      setLoading(false);
      return data;
    },
    [createQuery],
  );

  return { data, isLoading, mutate, get: api };
}
