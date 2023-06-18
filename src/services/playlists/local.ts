import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { nanoid } from 'nanoid';

import { badRequest, conflict, notFound } from '../../lib/api/ApiError';
import type { ApiResponse } from '../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../types/SingingStream';
import { apiClient } from '../apiClient';
import type { Playlist, PlaylistItemWithMusic, PlaylistWithItem } from './type';

const PLAYLIST_STORAGE_KEY = 'playlists';

type LocalApiResponse<T> = ApiResponse<T> & {
  data: T;
};

export const createFetcher = (
  fetcherFuncWhenLoggedIn: (key: string, ...args: any[]) => any,
  fetcherFuncWhenLoggedOut: (key: string, ...args: any[]) => any,
) => {
  return async (key: string, method: string = 'get', ...args: any[]): Promise<any> => {
    const supabase = createPagesBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return fetcherFuncWhenLoggedIn(key, method, ...args);
    } else {
      // url に playlistId が含まれている場合、それを抽出して arg として与える
      const regex = /\/api\/playlists\/([^\/]+)(?:\/items\/([^\/]+))?/;
      const match = key.match(regex);
      if (match) {
        const playlistId = match[1];
        const itemId = match[2];

        if (playlistId) {
          if (args.length) {
            args[0] = { ...args[0], playlistId };
          } else {
            args[0] = { playlistId };
          }
        }
        if (itemId) {
          if (args.length) {
            args[0] = { ...args[0], itemId };
          } else {
            args[0] = { itemId };
          }
        }
      }
      // const playlistId = match && match.length >= 1 ? match[1] : null;
      // console.log('debug:playlistId', playlistId);
      // const arg = args.length
      //   ? playlistId
      //     ? { ...args[0], playlistId }
      //     : args[0]
      //   : playlistId
      //   ? { playlistId }
      //   : null;
      // if (arg) {
      //   args[0] = arg;
      // }
      return fetcherFuncWhenLoggedOut(PLAYLIST_STORAGE_KEY, ...args);
    }
  };
};

export async function getLocalPlaylists(key: string): Promise<LocalApiResponse<PlaylistWithItem[]>> {
  try {
    const playlists: PlaylistWithItem[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    return { data: playlists };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLocalPlaylistDetail(
  key: string,
  arg: { playlistId: Playlist['id'] },
): Promise<LocalApiResponse<PlaylistWithItem>> {
  console.log('debug:arg', arg);
  try {
    const { data: playlists } = await getLocalPlaylists(key);
    const playlist = playlists.find((p) => p.id === arg.playlistId);
    if (!playlist) {
      throw notFound();
    }

    return { data: playlist };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createLocalPlaylist(
  key: string,
  arg: Pick<Playlist, 'title' | 'description'>,
): Promise<LocalApiResponse<PlaylistWithItem[]>> {
  console.log('debug:arg', arg);
  try {
    const { data: playlists } = await getLocalPlaylists(key);

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
    localStorage.setItem(key, JSON.stringify(playlists));
    return Promise.resolve({ data: playlists });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteLocalPlaylist(
  key: string,
  arg: Pick<Playlist, 'id'>,
): Promise<LocalApiResponse<PlaylistWithItem[]>> {
  try {
    const { data: playlists } = await getLocalPlaylists(key);

    const deletedPlaylists = playlists.filter((p) => p.id !== arg.id);
    localStorage.setItem(key, JSON.stringify(deletedPlaylists));
    return Promise.resolve({ data: deletedPlaylists });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addLocalPlaylistItem(
  key: Playlist['id'],
  arg: { playlistId: Playlist['id']; musicId: PlaylistItemWithMusic['musicId'] },
): Promise<LocalApiResponse<Playlist[]>> {
  try {
    const { data: music } = await apiClient<ApiResponse<SingingStreamWithVideoAndSong>>(
      `/api/singing-streams/${arg.musicId}`,
    );
    if (!music) {
      throw badRequest('item is not found');
    }

    const { data: playlists } = await getLocalPlaylists(key);

    playlists.forEach((playlist) => {
      if (playlist.id !== arg.playlistId) return;

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

    localStorage.setItem(key, JSON.stringify(playlists));
    return Promise.resolve({ data: playlists });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteLocalPlaylistItem(
  key: Playlist['id'],
  arg: { playlistId: Playlist['id']; itemId: PlaylistItemWithMusic['id']; musicId: PlaylistItemWithMusic['musicId'] },
): Promise<LocalApiResponse<Playlist[]>> {
  console.log('debug:arg', arg);

  try {
    const { data: playlists } = await getLocalPlaylists(key);

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
    localStorage.setItem(key, JSON.stringify(playlists));
    return Promise.resolve({ data: playlists });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

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
