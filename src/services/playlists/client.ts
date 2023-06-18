import { notifications } from '@mantine/notifications';
import type { PlaylistItem } from '@prisma/client';
import { useUser } from '@supabase/auth-helpers-react';
import { useT } from '@transifex/react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import type { ApiResponse } from '../../types/api';
import { apiClient } from '../apiClient';
import {
  addLocalPlaylistItem,
  createFetcher,
  createLocalPlaylist,
  deleteLocalPlaylist,
  deleteLocalPlaylistItem,
  getLocalPlaylistDetail,
  getLocalPlaylists,
} from './local';
import type { Playlist, PlaylistWithItem } from './type';

const KEY = '/api/playlists';

export function usePlaylists() {
  const fetcher = createFetcher(apiClient, getLocalPlaylists);
  const { data, error } = useSWR<ApiResponse<Playlist[]>>(KEY, fetcher);

  return { playlists: data?.data, isLoading: !data && !error };
}

export function usePlaylistDetails(playlistId: Playlist['id'] | undefined) {
  const fetcher = createFetcher(apiClient, getLocalPlaylistDetail);

  const { data, error } = useSWR<ApiResponse<PlaylistWithItem>>(playlistId ? `${KEY}/${playlistId}` : null, fetcher);

  return { playlist: data?.data, isLoading: !data && !error };
}

export function useCreatePlaylist() {
  const t = useT();

  const client = createFetcher(apiClient, createLocalPlaylist);

  async function fetcher(key: string, { arg }: { arg: Pick<Playlist, 'title' | 'description'> }) {
    return client(key, 'post', arg);
  }

  const { trigger } = useSWRMutation(KEY, fetcher);

  async function createPlaylist(...args: Parameters<typeof trigger>) {
    return trigger(...args).then(() => {
      notifications.show({ message: t('プレイリストを作成しました') });
    });
  }

  return { createPlaylist };
}

export function useEditPlaylist() {
  const t = useT();

  async function fetcher(key: string, { arg }: { arg: Pick<Playlist, 'id' | 'title' | 'description'> }) {
    return apiClient<Playlist & PlaylistItem[]>(`${key}/${arg.id}`, 'put', arg);
  }

  const { trigger } = useSWRMutation(KEY, fetcher);

  async function editPlaylist(...args: Parameters<typeof trigger>) {
    return trigger(...args).then(() => {
      notifications.show({ message: t('プレイリストを編集しました') });
    });
  }

  return { editPlaylist };
}

export function useDeletePlaylist() {
  const t = useT();

  const client = createFetcher(apiClient, deleteLocalPlaylist);

  async function fetcher(key: string, { arg }: { arg: Pick<Playlist, 'id'> }) {
    return client(`${key}/${arg.id}`, 'delete', arg);
  }

  const { trigger } = useSWRMutation(KEY, fetcher);

  async function deletePlaylist(...args: Parameters<typeof trigger>) {
    if (confirm(t('プレイリストを削除しますか？'))) {
      return trigger(...args).then(() => {
        notifications.show({ message: t('プレイリストを削除しました') });
      });
    }
  }

  return { deletePlaylist };
}

export function useAddPlaylistItem(playlistId: Playlist['id']) {
  const t = useT();

  const client = createFetcher(apiClient, addLocalPlaylistItem);

  async function fetcher(url: string, { arg }: { arg: { musicId: PlaylistItem['musicId'] } }) {
    return client(`${url}/items`, 'post', arg);
  }

  const { trigger } = useSWRMutation(playlistId ? `${KEY}/${playlistId}` : null, fetcher);

  async function addPlaylistItem(...args: Parameters<typeof trigger>) {
    return trigger(...args).then(() => {
      notifications.show({ message: t('プレイリストにアイテムを追加しました') });
    });
  }

  return { addPlaylistItem };
}

export function useDeletePlaylistItem(playlistId: Playlist['id']) {
  const t = useT();

  const client = createFetcher(apiClient, deleteLocalPlaylistItem);

  async function fetcher(url: string, { arg }: { arg: { itemId: PlaylistItem['id'] } }) {
    return client(`${url}/items/${arg.itemId}`, 'delete', arg);
  }

  const { trigger } = useSWRMutation(playlistId ? `${KEY}/${playlistId}` : null, fetcher);

  async function deletePlaylistItem(...args: Parameters<typeof trigger>) {
    if (confirm('アイテムを削除しますか？')) {
      return trigger(...args).then(() => {
        notifications.show({ message: t('プレイリストのアイテムを削除しました') });
      });
    }
  }

  return { deletePlaylistItem };
}

/**
 * プレイリストのアイテムを並び替える
 */
export function useSortPlaylistItem(playlistId: Playlist['id']) {
  async function fetcher(url: string, { arg }: { arg: { sortedIds: PlaylistItem['id'][] } }) {
    return apiClient(`${url}/items`, 'put', arg);
  }

  const { trigger: sortPlaylistItem } = useSWRMutation(playlistId ? `${KEY}/${playlistId}` : null, fetcher);

  return { sortPlaylistItem };
}
