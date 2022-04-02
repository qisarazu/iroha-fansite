import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

import { parseDuration } from '../../../utils/parseDuration';

type GetVideoResponse = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  duration: number;
};

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
});

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const videoId: string = (Array.isArray(req.query.videoId) ? req.query.videoId[0] : req.query.videoId).replace(
    /['"]+/g,
    '',
  );

  const { data } = await youtube.videos.list({
    part: ['snippet', 'contentDetails'],
    id: [videoId],
    fields:
      'items(id,snippet(title,publishedAt,thumbnails(default(url),medium(url),high(url))),contentDetails(duration))',
  });

  if (
    !data.items?.length ||
    !data.items[0] ||
    !data.items[0].id ||
    !data.items[0].snippet ||
    !data.items[0].snippet.title ||
    !data.items[0].snippet.publishedAt ||
    !data.items[0].snippet.thumbnails ||
    !data.items[0].snippet.thumbnails.default ||
    !data.items[0].snippet.thumbnails.default.url ||
    !data.items[0].snippet.thumbnails.medium ||
    !data.items[0].snippet.thumbnails.medium.url ||
    !data.items[0].snippet.thumbnails.high ||
    !data.items[0].snippet.thumbnails.high.url ||
    !data.items[0].contentDetails ||
    !data.items[0].contentDetails.duration
  ) {
    res.status(404).json({ error: `${videoId} is not found.` });
    return;
  }

  const duration = parseDuration(data.items[0].contentDetails.duration);

  const response: GetVideoResponse = {
    id: data.items[0].id,
    title: data.items[0].snippet.title,
    publishedAt: data.items[0].snippet.publishedAt,
    thumbnails: {
      default: data.items[0].snippet.thumbnails.default.url,
      medium: data.items[0].snippet.thumbnails.medium.url,
      high: data.items[0].snippet.thumbnails.high.url,
    },
    duration: duration,
  };
  res.status(200).json(response);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return get(req, res);
    }
  }
}
