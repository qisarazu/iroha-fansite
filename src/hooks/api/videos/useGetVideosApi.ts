import type { Video } from '@prisma/client';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from '../../../utils/fetcher';

export function useGetVideosApi() {
  return useSWRImmutable<Video[]>('/api/videos', fetcher);
}
