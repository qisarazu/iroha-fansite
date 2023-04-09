import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { DeleteSongApiRequest } from '../../../pages/api/songs/[id]';
import type { ApiResponse } from '../../../types/api';
import { fetcher } from '../../../utils/fetcher';

type Props = {
  mutate: KeyedMutator<ApiResponse<Song[]>>;
};

export function useDeleteSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: DeleteSongApiRequest): Promise<void> => {
      setLoading(true);

      await fetcher(`/api/songs/${request.id}`, 'delete');

      mutate();

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
