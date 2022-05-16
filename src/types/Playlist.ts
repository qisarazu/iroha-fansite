import type { Playlist } from '@prisma/client';

import type { SingingStreamWithVideoAndSong } from './SingingStream';

export type PlaylistWithItems = Playlist & {
  items: SingingStreamWithVideoAndSong[];
};
