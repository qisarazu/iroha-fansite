import type { Playlist } from '../services/playlists/type';

export type SingingStreamWatchPageQuery = {
  v: string;
  playlist?: Playlist['id'];
  shuffle?: '1';
};
