import type { Song } from '@prisma/client';
import { useCallback, useState } from 'react';
import type { KeyedMutator } from 'swr';

import type { DeleteSongApiRequest } from '../../../pages/api/songs/[id]';

type Props = {
  mutate: KeyedMutator<Song[]>;
};

export function useDeleteSongApi({ mutate }: Props) {
  const [isLoading, setLoading] = useState(false);

  const api = useCallback(
    async (request: DeleteSongApiRequest): Promise<void> => {
      setLoading(true);

      await fetch(`/api/songs/${request.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      mutate((data) => (data ? data.filter((song) => song.id !== request.id) : []));

      setLoading(false);
    },
    [mutate],
  );

  return { api, isLoading };
}
