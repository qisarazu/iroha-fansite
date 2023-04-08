import useSWRInfinite from 'swr/infinite';

import type { GetSingingStreamsRequest } from '../../../pages/api/singing-streams';
import type { CursorResponse } from '../../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  request?: Omit<GetSingingStreamsRequest, 'cursor'>;
};

export function useGetSingingStreamsApi({ request }: Props = {}) {
  const { data, isLoading, isValidating, setSize } = useSWRInfinite<CursorResponse<SingingStreamWithVideoAndSong[]>>(
    (pageIndex, previousPageData) => {
      // In last page.
      if (previousPageData && !previousPageData.data.length) return null;

      const url = new URL('/api/singing-streams', location.origin);
      const search = new URLSearchParams();

      for (const key in request) {
        const value = request[key as keyof typeof request];
        if (!value) break;
        const strValue = typeof value === 'string' ? value : `${value}`;
        search.append(key, strValue);
      }

      if (pageIndex !== 0 && previousPageData && previousPageData.nextCursor) {
        search.append('cursor', previousPageData.nextCursor);
      }
      url.search = search.toString();

      return url.toString();
    },
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    },
  );

  const flattenData = data?.flatMap((page) => page.data?.filter((d): d is SingingStreamWithVideoAndSong => !!d) ?? []);
  const hasNext = data?.at(-1)?.hasNext;

  return { data: flattenData, isLoading: !data || isLoading, isValidating, hasNext, setSize };
}
