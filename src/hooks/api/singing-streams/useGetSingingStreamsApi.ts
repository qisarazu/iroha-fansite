import { useCallback, useMemo, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import urlcat from 'urlcat';

import type { GetSingingStreamsRequest } from '../../../pages/api/singing-streams';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request?: GetSingingStreamsRequest;
};

export function useGetSingingStreamsApi({ request }: Props = {}) {
  const [isLoading, setLoading] = useState(false);

  const url = useMemo(() => urlcat('/api/singing-streams', request ?? {}), [request]);

  const { data, mutate } = useSWRImmutable<SingingStreamWithVideoAndSong[]>(url, fetcher);

  const refetch = useCallback(async () => {
    setLoading(true);

    const newData = await fetcher<SingingStreamWithVideoAndSong[]>(url);
    mutate(newData);

    setLoading(false);
  }, [mutate, url]);

  return { data: data ?? [], isLoading: isLoading || !data, refetch, mutate };
}
