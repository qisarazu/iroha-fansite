import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { nanoid } from 'nanoid';
import { Key, pathToRegexp } from 'path-to-regexp';

import { badRequest, conflict, notFound } from '../../lib/api/ApiError';
import type { ApiResponse } from '../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../types/SingingStream';
import { apiClient, Method } from '../apiClient';
import {
  MAX_PLAYLIST_DESCRIPTION_LENGTH,
  MAX_PLAYLIST_ITEMS_PER_PLAYLIST,
  MAX_PLAYLIST_TITLE_LENGTH,
  MAX_PLAYLISTS_PER_USER,
} from './constant';
import type { Playlist, PlaylistItemWithMusic, PlaylistWithItem } from './type';

type LocalApiResponse<T> = ApiResponse<T> & {
  data: T;
};

type ReturnType = Promise<LocalApiResponse<PlaylistWithItem[]>> | Promise<LocalApiResponse<PlaylistWithItem>>;

const PLAYLIST_STORAGE_KEY = 'playlists';

const routeMap: Record<string, (...args: any[]) => ReturnType> = {
  'GET /api/playlists': getLocalPlaylists,
  'POST /api/playlists': createLocalPlaylist,
  'PUT /api/playlists/:playlistId': editLocalPlaylist,
  'DELETE /api/playlists/:playlistId': deleteLocalPlaylist,
  'GET /api/playlists/:playlistId': getLocalPlaylistDetail,
  'POST /api/playlists/:playlistId/items': addLocalPlaylistItem,
  'PUT /api/playlists/:playlistId/items': sortLocalPlaylistItems,
  'DELETE /api/playlists/:playlistId/items/:itemId': deleteLocalPlaylistItem,
};

export const createClient = () => {
  return async <T>(url: string, method: Method = 'get', body?: Record<string, unknown>): Promise<T> => {
    const supabase = createPagesBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return apiClient<T>(url, method, body);
    } else {
      for (const route in routeMap) {
        const keys: Key[] = [];
        const [routeMethod, routePath] = route.split(' ');
        if (routeMethod !== method.toUpperCase()) continue;

        const re = pathToRegexp(routePath, keys);
        const result = re.exec(url);
        if (result) {
          const params = parseParams(keys, result);
          const arg = Object.assign(params, body);
          return <T>routeMap[route as keyof typeof routeMap](arg);
        }
      }
      throw new Error(`No route found for ${method} ${url}`);
    }
  };
};

function parseParams(keys: Key[], result: RegExpExecArray) {
  return keys.reduce((acc, cur, i) => {
    acc[`${cur.name}`] = result[i + 1];
    return acc;
  }, {} as Record<string, unknown>);
}

/**
 * localStorage からプレイリスト一覧を取得する
 */
async function getLocalPlaylists(): Promise<LocalApiResponse<PlaylistWithItem[]>> {
  try {
    const playlists: PlaylistWithItem[] = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) ?? '[]');
    playlists.forEach((playlist) => {
      playlist.createdAt = new Date(playlist.createdAt);
    });
    playlists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage から指定されたプレイリストを取得する
 */
async function getLocalPlaylistDetail(arg: { playlistId: Playlist['id'] }) {
  try {
    const { data: playlists } = await getLocalPlaylists();
    const playlist = playlists.find((p) => p.id === arg.playlistId);
    if (!playlist) {
      throw notFound();
    }

    playlist.items.sort((a, b) => a.position - b.position);

    return { data: playlist };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage にプレイリストを追加する
 */
async function createLocalPlaylist(arg: Pick<Playlist, 'title' | 'description'>) {
  try {
    const { data: playlists } = await getLocalPlaylists();

    // validation
    if (Array.from(arg.title).length > MAX_PLAYLIST_TITLE_LENGTH) {
      throw badRequest(`Playlist title must be less than ${MAX_PLAYLIST_TITLE_LENGTH} characters`);
    }
    if (arg.description && Array.from(arg.description).length > MAX_PLAYLIST_DESCRIPTION_LENGTH) {
      throw badRequest(`Playlist description must be less than ${MAX_PLAYLIST_DESCRIPTION_LENGTH} characters`);
    }
    if (playlists.length >= MAX_PLAYLISTS_PER_USER) {
      throw badRequest(`You can only create up to ${MAX_PLAYLISTS_PER_USER} playlists.`);
    }

    const newPlaylist: PlaylistWithItem = {
      id: nanoid(12),
      title: arg.title,
      description: arg.description,
      items: [],
      thumbnailURLs: [],
      ownerId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    playlists.push(newPlaylist);
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage のプレイリストを編集する
 */
async function editLocalPlaylist(arg: Pick<Playlist, 'id' | 'title' | 'description'>) {
  try {
    const { data: playlists } = await getLocalPlaylists();

    // validation
    if (Array.from(arg.title).length > MAX_PLAYLIST_TITLE_LENGTH) {
      throw badRequest(`Playlist title must be less than ${MAX_PLAYLIST_TITLE_LENGTH} characters`);
    }
    if (arg.description && Array.from(arg.description).length > MAX_PLAYLIST_DESCRIPTION_LENGTH) {
      throw badRequest(`Playlist description must be less than ${MAX_PLAYLIST_DESCRIPTION_LENGTH} characters`);
    }

    const targetIndex = playlists.findIndex((playlist) => playlist.id === arg.id);
    if (targetIndex === -1) {
      throw notFound();
    }

    playlists[targetIndex] = { ...playlists[targetIndex], title: arg.title, description: arg.description };

    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage のプレイリストを削除する
 */
async function deleteLocalPlaylist(arg: Pick<Playlist, 'id'>) {
  try {
    const { data: playlists } = await getLocalPlaylists();

    const deletedPlaylists = playlists.filter((p) => p.id !== arg.id);

    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(deletedPlaylists));
    return { data: deletedPlaylists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage のプレイリストにアイテムを追加する
 */
async function addLocalPlaylistItem(arg: { playlistId: Playlist['id']; musicId: PlaylistItemWithMusic['musicId'] }) {
  try {
    const { data: music } = await apiClient<ApiResponse<SingingStreamWithVideoAndSong>>(
      `/api/singing-streams/${arg.musicId}`,
    );
    if (!music) {
      throw badRequest('item is not found');
    }

    const { data: playlists } = await getLocalPlaylists();

    playlists.forEach((playlist) => {
      if (playlist.id !== arg.playlistId) return;

      // validation
      if (playlist.items.length >= MAX_PLAYLIST_ITEMS_PER_PLAYLIST) {
        throw badRequest(`A playlist can only have up to ${MAX_PLAYLIST_ITEMS_PER_PLAYLIST} items.`);
      }

      // item の重複チェック
      const playlistItemIdSet = new Set(playlist.items.map((item) => item.musicId));
      if (playlistItemIdSet.has(music.id)) {
        throw conflict('ItemAlreadyExists');
      }

      playlist.items.push({
        id: nanoid(12),
        music: music,
        musicId: music.id,
        position: playlist.items.length + 1,
        playlistId: arg.playlistId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      playlist = updateLocalPlaylistThumbnailURLs(playlist);
    });

    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage のプレイリストからアイテムを削除する
 */
async function deleteLocalPlaylistItem(arg: { playlistId: Playlist['id']; itemId: PlaylistItemWithMusic['id'] }) {
  try {
    const { data: playlists } = await getLocalPlaylists();

    const playlistIndex = playlists.findIndex((p) => p.id === arg.playlistId);
    if (playlistIndex < 0) {
      throw notFound();
    }

    const itemIndex = playlists[playlistIndex].items.findIndex((item) => item.id === arg.itemId);
    const itemToDelete = playlists[playlistIndex].items[itemIndex];

    // Update positions of items that are after the item to delete
    playlists[playlistIndex].items.forEach((item) => {
      if (item.position > itemToDelete.position) {
        item.position--;
      }
    });

    // Delete the item
    playlists[playlistIndex].items.splice(itemIndex, 1);

    playlists[playlistIndex] = updateLocalPlaylistThumbnailURLs(playlists[playlistIndex]);
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage のプレイリストのアイテムを並び替える
 */
async function sortLocalPlaylistItems(arg: { playlistId: Playlist['id']; sortedIds: PlaylistItemWithMusic['id'][] }) {
  try {
    const { data: playlists } = await getLocalPlaylists();
    const targetPlaylistIndex = playlists.findIndex((playlist) => playlist.id === arg.playlistId);

    if (targetPlaylistIndex === -1) {
      throw notFound();
    }

    const targetPlaylist = playlists[targetPlaylistIndex];

    // validation
    const validIds = targetPlaylist.items.map((item) => item.id);
    const isValid = arg.sortedIds.length === validIds.length && validIds.every((id) => arg.sortedIds.includes(id));
    if (!isValid) {
      throw badRequest('Invalid playlist item ID');
    }

    arg.sortedIds.forEach((id, index) => {
      const item = targetPlaylist.items.find((item) => item.id === id);
      if (!item) {
        throw badRequest('Item not found');
      }
      item.position = index + 1;
    });

    playlists[targetPlaylistIndex] = targetPlaylist;

    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlists));
    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * localStorage のプレイリストのサムネイルを更新する
 */
function updateLocalPlaylistThumbnailURLs(playlist: PlaylistWithItem) {
  const uniqueThumbnails = Array.from(new Set(playlist.items.map((item) => item.music.video.thumbnailMediumUrl)));

  const thumbnailURLs = uniqueThumbnails.length
    ? uniqueThumbnails.length < 4
      ? [uniqueThumbnails[0]]
      : uniqueThumbnails.slice(0, 4)
    : [];

  playlist.thumbnailURLs = thumbnailURLs;
  return playlist;
}
