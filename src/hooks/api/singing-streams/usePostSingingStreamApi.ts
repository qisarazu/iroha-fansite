import { useCallback, useState } from 'react';
import type { SWRInfiniteKeyedMutator } from 'swr/infinite';

import type { PostSingingStreamRequest } from '../../../pages/api/singing-streams';
import type { CursorResponse } from '../../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: SWRInfiniteKeyedMutator<CursorResponse<SingingStreamWithVideoAndSong[]>[]>;
};

export function usePostSingingStreamApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: PostSingingStreamRequest): Promise<void> => {
      setLoading(true);

      await fetcher<SingingStreamWithVideoAndSong>('/api/singing-streams', 'post', request);

      mutate();

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
