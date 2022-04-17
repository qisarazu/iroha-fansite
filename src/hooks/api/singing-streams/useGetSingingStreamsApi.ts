import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import urlcat from 'urlcat';

import type { SingingStreamWithVideoAndSong } from '../../../model';
import type { GetSingingStreamsRequest } from '../../../pages/api/singing-streams';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request?: GetSingingStreamsRequest;
};

export function useGetSingingStreamsApi({ request }: Props = {}) {
  const [isLoading, setLoading] = useState(false);

  const url = useMemo(() => urlcat('/api/singing-streams', request ?? {}), [request]);

  const { data, mutate } = useSWR<SingingStreamWithVideoAndSong[]>(url, fetcher);

  const refetch = useCallback(async () => {
    setLoading(true);

    const newData = await fetcher<SingingStreamWithVideoAndSong[]>(url);
    mutate(newData);

    setLoading(false);
  }, [mutate, url]);

  return { data, isLoading, refetch, mutate };
}
