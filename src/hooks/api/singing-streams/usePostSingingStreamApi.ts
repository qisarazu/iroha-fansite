import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { SingingStreamWithVideoAndSong } from '../../../model';
import type { PostSingingStreamRequest } from '../../../pages/api/singing-streams';

type Props = {
  mutate: KeyedMutator<SingingStreamWithVideoAndSong[]>;
};

export function usePostSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostSingingStreamRequest): Promise<void> => {
      setLoading(true);

      const newData = await fetch('/api/singing-streams', {
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
