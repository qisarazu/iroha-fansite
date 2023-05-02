import type { Playlist } from '@prisma/client';
import useSWRMutation, { type MutationFetcher } from 'swr/mutation';

import type { PostPlaylistRequest } from '../../../pages/api/playlists';
import { fetcher } from '../../../utils/fetcher';

export function useCreatePlaylist() {
  const url = new URL('/api/playlists', location.origin);

  const _fetcher = (key: string, { arg }: { arg: PostPlaylistRequest }) => {
    return fetcher<Playlist>(key, 'post', arg);
  };

  const { trigger } = useSWRMutation<Playlist, any, string, PostPlaylistRequest>(url.toString(), _fetcher);

  return trigger;
}
