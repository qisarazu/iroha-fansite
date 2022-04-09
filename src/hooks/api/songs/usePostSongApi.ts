import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PostSongApiRequest } from '../../../pages/api/songs';

type Props = {
  mutate: KeyedMutator<Song[]>;
};

export function usePostSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostSongApiRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }).then((res) => res.json());

      mutate((data) => (data ? [...data, newData] : [newData]));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
