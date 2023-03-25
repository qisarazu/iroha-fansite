import { useMemo } from 'react';

type Option = {
  shuffle: boolean;
};

export function useWatchUrl(id: string, option?: Option) {
  return useMemo(() => {
    const query = new URLSearchParams();

    query.append('v', id);
    if (option?.shuffle) {
      query.append('shuffle', '1');
    }

    return `/singing-streams/watch?${query.toString()}`;
  }, [id, option]);
}
