import type { Playlist } from '@prisma/client';
import useSWR from 'swr';

import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

export function useGetPlaylists() {
  const { data, isLoading } = useSWR<ApiResponse<Playlist[]>>('/api/playlists', fetcher);

  return { data: data?.data, isLoading: !data || isLoading };
}
