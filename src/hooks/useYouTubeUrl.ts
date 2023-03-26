import { useMemo } from 'react';

export function useYouTubeUrl(id: string, start?: number) {
  return useMemo(() => {
    const query = new URLSearchParams();
    query.append('v', id);
    if (start) {
      query.append('t', `${start}s`);
    }

    return `https://www.youtube.com/watch?${query.toString()}`;
  }, [id, start]);
}
