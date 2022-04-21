import type { Video } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import urlcat from 'urlcat';

import type { GetVideosApiRequest } from '../../../pages/api/videos';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request?: GetVideosApiRequest;
};

export function useGetVideosApi({ request }: Props = {}) {
  const [isLoading, setLoading] = useState(false);

  const url = useMemo(() => urlcat('/api/videos', request ?? {}), [request]);

  const { data, mutate } = useSWRImmutable<Video[]>(url, fetcher);

  const refetch = useCallback(async () => {
    setLoading(true);

    const newData = await fetcher<Video[]>(url);
    mutate(newData);

    setLoading(false);
  }, [mutate, url]);

  return { data: data ?? [], isLoading: isLoading || !data, mutate, refetch };
}
