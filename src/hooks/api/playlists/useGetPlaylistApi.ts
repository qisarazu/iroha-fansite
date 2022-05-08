import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';
import urlcat from 'urlcat';

import type { PlaylistWithItems } from '../../../types/Playlist';
import { fetcher } from '../../../utils/fetcher';

/**
 * Get a single Playlist.
 * If id arg is not passed, fetch is not performed.
 */
export function useGetPlaylistApi(id?: PlaylistWithItems['id']) {
  const key = useMemo(() => (id ? urlcat('/api/playlists/:id', { id }) : null), [id]);

  const { data } = useSWRImmutable<PlaylistWithItems>(key, fetcher);

  return { data, isLoading: key && !data };
}
