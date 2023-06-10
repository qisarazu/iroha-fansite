import type { PlaylistItem, SingingStream, Song, Video } from '@prisma/client';

import type { getPlaylists } from './server';

export type Playlist = Awaited<ReturnType<typeof getPlaylists>>[0];

export type PlaylistWithItem = Playlist & {
  items: PlaylistItemWithMusic[];
};

export type PlaylistItemWithMusic = PlaylistItem & {
  music: SingingStream & {
    song: Song;
    video: Video;
  };
};

export type PostPlaylistRequest = {
  title: Playlist['title'];
  description?: Playlist['description'];
};
