import type { Playlist } from '@prisma/client';

export type SingingStreamWatchPageQuery = {
  v: string;
  playlist?: Playlist['id'];
  shuffle?: '1';
};
