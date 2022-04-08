import { useCallback } from 'react';
import { useSWRConfig } from 'swr';
import useSWRImmutable from 'swr/immutable';

import type { GetYouTubeVideoResponse } from '../../../pages/api/youtube/videos/[id]';
import { fetcher } from '../../../utils/fetcher';

const BASE_KEY = `/api/youtube/videos/`;

export function useGetYouTubeVideoApi(id: string) {
  return useSWRImmutable<GetYouTubeVideoResponse>(`${BASE_KEY}${id}`, fetcher);
}

export function useYouTubeVideoApiFetcher() {
  const { mutate } = useSWRConfig();

  return useCallback(
    async (id: string) => {
      const data = await fetcher<GetYouTubeVideoResponse>(`${BASE_KEY}${id}`);
      await mutate<GetYouTubeVideoResponse>(`${BASE_KEY}${id}`, data);
      return data;
    },
    [mutate],
  );
}
