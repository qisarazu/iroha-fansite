import type { PlaylistItem, SingingStream, Song, Video } from '@prisma/client';

import type { getPlaylistDetails, getPlaylists } from './server';

export type Playlist = Awaited<ReturnType<typeof getPlaylists>>[0];

export type PlaylistWithItem = Exclude<Awaited<ReturnType<typeof getPlaylistDetails>>, null>;

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
