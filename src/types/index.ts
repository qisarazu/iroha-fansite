export type Video = {
  id: string;
  video_id: string;
  title: string;
  length: number;
  url: string;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  title_en?: string;
  artist_en?: string;
  created_at: string;
  updated_at: string;
};

export type SingingStream = {
  id: string;
  song_title: string;
  song_artist: string;
  start: number;
  end: number;
  video_id: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  video: Video;
};

export type SingingStreamForSearch = Pick<SingingStream, 'id' | 'start' | 'video_id' | 'published_at'> & {
  song: Pick<Song, 'title' | 'artist' | 'title_en' | 'artist_en'>;
  video: Pick<Video, 'title' | 'url'>;
};

export type SingingStreamForWatch = Pick<SingingStream, 'id' | 'start' | 'end' | 'video_id' | 'published_at'> & {
  song: Pick<Song, 'title' | 'artist' | 'title_en' | 'artist_en'>;
};
