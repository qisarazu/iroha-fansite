import { useCallback } from 'react';
import { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';

import type { GetYouTubeVideoResponse } from '../../../pages/api/youtube/videos/[id]';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

const BASE_KEY = `/api/youtube/videos/`;

export function useGetYouTubeVideoApi(id: string) {
  return useSWRImmutable<ApiResponse<GetYouTubeVideoResponse>>(`${BASE_KEY}${id}`, fetcher);
}

export function useYouTubeVideoApiFetcher() {
  const { mutate } = useSWRConfig();

  return useCallback(
    async (id: string) => {
      const { data } = await fetcher<ApiResponse<GetYouTubeVideoResponse>>(`${BASE_KEY}${id}`);
      await mutate(`${BASE_KEY}${id}`);
      return data;
    },
    [mutate],
  );
}
