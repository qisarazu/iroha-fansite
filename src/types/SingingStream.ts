import type { SingingStream, Song, Video } from '@prisma/client';

export type SingingStreamWithVideoAndSong = SingingStream & {
  video: Video;
  song: Song;
};
