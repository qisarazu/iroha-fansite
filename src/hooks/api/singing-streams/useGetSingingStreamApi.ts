import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import urlcat from 'urlcat';

import type { ApiResponse } from '../../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

/**
 * Get a single SingingStream.
 * If id arg is not passed, fetch is not performed.
 */
export function useGetSingingStreamApi(id?: SingingStreamWithVideoAndSong['id']) {
  const key = useMemo(() => (id ? urlcat('/api/singing-streams/:id', { id }) : null), [id]);

  const { data, isLoading, isValidating } = useSWRImmutable<ApiResponse<SingingStreamWithVideoAndSong>>(key, fetcher);

  return { data: data?.data, isLoading: !data || !isLoading, isValidating };
}
