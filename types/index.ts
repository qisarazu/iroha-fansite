export type Video = {
  id: string;
  title: string;
  length: number;
  url: string;
};

export type SingingStream = Video & {
  songId: string;
  songTitle: string;
  songArtist: string;
  startAt: number;
  endAt: number;
};
