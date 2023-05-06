import type { Playlist } from '@prisma/client';

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
    url += `&${key}=${query[key as keyof MusicWatchQuery]}`;
  }

  return url;
}

export function getYouTubeURL(videoId: string, start?: number) {
  let url = `https://youtu.be/${videoId}`;
  if (start) {
    url += `?t=${start}`;
  }
  return url;
}
