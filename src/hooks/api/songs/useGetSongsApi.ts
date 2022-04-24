import type { Song } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import urlcat from 'urlcat';

import type { GetSongsApiRequest } from '../../../pages/api/songs';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request?: GetSongsApiRequest;
};

export function useGetSongsApi({ request }: Props = {}) {
  const [isLoading, setLoading] = useState(false);

  const url = useMemo(() => urlcat('/api/songs', request ?? {}), [request]);

  const { data, mutate } = useSWRImmutable<Song[]>(url, fetcher);

  const refetch = useCallback(async () => {
    setLoading(true);

    const newData = await fetcher<Song[]>(url);
    mutate(newData);

    setLoading(false);
  }, [mutate, url]);

  return { data: data ?? [], isLoading: isLoading || !data, refetch, mutate };
}
