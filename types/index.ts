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

export type SingingStream = {
  id: string;
  song_title: string;
  song_artist: string;
  start: number;
  end: number;
  video_id: string;
  created_at: string;
  updated_at: string;
  video: Video;
};
