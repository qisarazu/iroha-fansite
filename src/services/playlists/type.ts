import type { Playlist, PlaylistItem, SingingStream, Song, Video } from '@prisma/client';

export type PlaylistItemWithMusic = PlaylistItem & {
  music: SingingStream & {
    song: Song;
    video: Video;
  };
};

export type PlaylistWithItem = Playlist & {
  items: PlaylistItemWithMusic[];
};

export type PostPlaylistRequest = {
  title: Playlist['title'];
  description?: Playlist['description'];
};
