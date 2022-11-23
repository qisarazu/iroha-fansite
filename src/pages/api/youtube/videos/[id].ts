import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

import type { ApiResponse } from '../../../../types/api';
import { asAdminRequireApi } from '../../../../utils/asAdminRequireApi';
import { parseDuration } from '../../../../utils/parseDuration';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export type GetYouTubeVideoRequestQuery = {
  id: string;
};

export type GetYouTubeVideoResponse = {
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
const get = async (req: NextApiRequest, res: NextApiResponse<ApiResponse<GetYouTubeVideoResponse>>) => {
  const videoId: string = (req.query as GetYouTubeVideoRequestQuery).id.replace(/['"]+/g, '');

  const { data } = await youtube.videos.list({
    part: ['snippet', 'contentDetails'],
    id: [videoId],
    fields:
      'items(id,snippet(title,publishedAt,thumbnails(default(url),medium(url),high(url))),contentDetails(duration))',
  });

  const video = data.items?.[0];

  if (
    !video ||
    !video.id ||
    !video.snippet?.title ||
    !video.snippet?.publishedAt ||
    !video.snippet?.thumbnails?.default?.url ||
    !video.snippet?.thumbnails?.medium?.url ||
    !video.snippet?.thumbnails?.high?.url ||
    !video.contentDetails?.duration
  ) {
    res.status(404).json({ error: `${videoId} is not found.` });
    return;
  }

  const response: GetYouTubeVideoResponse = {
    id: video.id,
    title: video.snippet.title,
    publishedAt: video.snippet.publishedAt,
    thumbnails: {
      default: video.snippet.thumbnails.default.url,
      medium: video.snippet.thumbnails.medium.url,
      high: video.snippet.thumbnails.high.url,
    },
    duration: parseDuration(video.contentDetails.duration),
  };
  res.status(200).json({ data: response });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return asAdminRequireApi(get, req, res);
    }
  }
}
