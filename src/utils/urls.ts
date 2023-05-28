import type { Playlist, PlaylistWithItem } from '../services/playlists/type';

export function getPlaylistURL(playlistId?: Playlist['id']) {
  let url = '/playlists';
  if (playlistId) {
    url += `/${playlistId}`;
  }
  return url;
}

type MusicWatchQuery = {
  shuffle?: '1';
  playlist?: Playlist['id'];
};

export function getMusicWatchURL(watchId: string, query?: MusicWatchQuery) {
  let url = `/singing-streams/watch?v=${watchId}`;

  for (const key in query) {
    const value = query[key as keyof MusicWatchQuery];
    if (value) {
      url += `&${key}=${value}`;
    }
  }

  return url;
}

export function getPlaylistWatchURL(playlist: Playlist, option: { shuffle?: boolean } = {}) {
  if (!playlist.items.length) return '';

  const firstItemId = option.shuffle
    ? playlist.items[Math.floor(Math.random() * playlist.items.length)].musicId
    : playlist.items[0].musicId;
  return getMusicWatchURL(firstItemId, { playlist: playlist.id, shuffle: option.shuffle ? '1' : undefined });
}

export function getYouTubeURL(videoId: string, start?: number) {
  let url = `https://youtu.be/${videoId}`;
  if (start) {
    url += `?t=${start}`;
  }
  return url;
}
