import type { Playlist, PlaylistItem } from '@prisma/client';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type { ApiResponse } from '../../types/api';
import { apiClient } from '../apiClient';
import type { PlaylistWithItem } from './type';

const KEY = '/api/playlists';

export function usePlaylists() {
  const { data, error } = useSWR<ApiResponse<Playlist[]>>(KEY, apiClient);

  return { playlists: data?.data, isLoading: !data && !error };
}

export function usePlaylistDetails(playlistId: Playlist['id'] | undefined) {
  const { data, error } = useSWR<ApiResponse<PlaylistWithItem>>(
    () => (playlistId ? `${KEY}/${playlistId}` : null),
    apiClient,
  );

  return { playlist: data?.data, isLoading: !data && !error };
}

export function useCreatePlaylist() {
  async function fetcher(key: string, { arg }: { arg: Pick<Playlist, 'title' | 'description'> }) {
    return apiClient<Playlist & PlaylistItem[]>(key, 'post', arg);
  }

  const { trigger: createPlaylist } = useSWRMutation(KEY, fetcher);

  return { createPlaylist };
}

export function useEditPlaylist() {
  async function fetcher(key: string, { arg }: { arg: Pick<Playlist, 'id' | 'title' | 'description'> }) {
    return apiClient<Playlist & PlaylistItem[]>(`${key}/${arg.id}`, 'put', arg);
  }

  const { trigger: editPlaylist } = useSWRMutation(KEY, fetcher);

  return { editPlaylist };
}

export function useDeletePlaylist() {
  async function fetcher(key: string, { arg }: { arg: Pick<Playlist, 'id'> }) {
    return apiClient<Playlist & PlaylistItem[]>(`${key}/${arg.id}`, 'delete', arg);
  }

  const { trigger } = useSWRMutation(KEY, fetcher);

  function deletePlaylist(arg: Parameters<typeof trigger>[0]) {
    if (confirm('プレイリストを削除しますか？')) {
      trigger(arg);
    }
  }

  return { deletePlaylist };
}

export function useAddPlaylistItem() {
  async function fetcher(
    key: string,
    { arg }: { arg: { playlistId: Playlist['id']; musicId: PlaylistItem['musicId'] } },
  ) {
    return apiClient(`${key}/${arg.playlistId}/items`, 'post', arg);
  }

  const { trigger: addPlaylistItem } = useSWRMutation(KEY, fetcher);

  return { addPlaylistItem };
}

export function useDeletePlaylistItem() {
  async function fetcher(key: string, { arg }: { arg: { playlistId: Playlist['id']; itemId: PlaylistItem['id'] } }) {
    return apiClient(`${key}/${arg.playlistId}/items`, 'delete', arg);
  }

  const { trigger: deletePlaylistItem } = useSWRMutation(KEY, fetcher);

  return { deletePlaylistItem };
}
