import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { PostSingingStreamRequest } from '../../../pages/api/singing-streams';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<SingingStreamWithVideoAndSong[]>;
};

export function usePostSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostSingingStreamRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetcher<SingingStreamWithVideoAndSong>('/api/singing-streams', 'post', request);

      mutate((data) => (data ? [...data, newData] : [newData]));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
