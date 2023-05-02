import type { Playlist } from '@prisma/client';
import useSWR from 'swr';

import type * as Id from '../../../pages/api/playlists/[id]';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request: Id.GetPlaylistRequest;
};

export function useGetPlaylist({ request }: Props) {
  const url = new URL('/api/playlists');
  const search = new URLSearchParams();
  search.append('id', request.id);

  const { data, isLoading } = useSWR<ApiResponse<Playlist>>(url.toString(), fetcher);

  return { data: data?.data, isLoading: !data || isLoading };
}
