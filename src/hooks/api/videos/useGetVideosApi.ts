import type { Video } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import urlcat from 'urlcat';

import type { GetVideosApiRequest } from '../../../pages/api/videos';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request?: GetVideosApiRequest;
};

export function useGetVideosApi({ request }: Props = {}) {
  const [isLoading, setLoading] = useState(false);

  const url = useMemo(() => urlcat('/api/videos', request ?? {}), [request]);

  const { data, mutate } = useSWRImmutable<ApiResponse<Video[]>>(url, fetcher);

  const refetch = useCallback(async () => {
    setLoading(true);

    await fetcher(url);
    mutate();

    setLoading(false);
  }, [mutate, url]);

  return { data: data?.data ?? [], isLoading: isLoading || !data, mutate, refetch };
}
