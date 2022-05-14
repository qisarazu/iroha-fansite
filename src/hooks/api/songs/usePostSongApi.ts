import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PostSongApiRequest } from '../../../pages/api/songs';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<Song[]>;
};

export function usePostSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostSongApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetcher<Song>('/api/songs', 'post', request);

      mutate((data) => (data ? [...data, newData] : [newData]));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
