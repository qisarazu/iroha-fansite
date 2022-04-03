import type { Video } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../utils/prismaClient';

export type GetVideosRequest = {
  orderBy?: keyof Video;
  orderDirection?: 'asc' | 'desc';
};
async function get(req: NextApiRequest, res: NextApiResponse<Video[]>) {
  const { orderBy, orderDirection } = req.query as GetVideosRequest;

  const videos = await prisma.video.findMany({
    orderBy: {
      [orderBy || 'publishedAt']: orderDirection || 'desc',
    },
  });

  res.status(200).json(videos);
}

export type PostVideosApiRequest = {
  videoId: string;
  title: string;
  duration: number;
  publishedAt: Date;
};
async function post(req: NextApiRequest, res: NextApiResponse<Video>) {
  const body: PostVideosApiRequest = req.body;

  const video = await prisma.video.create({
    data: body,
  });

  res.status(200).json(video);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      await get(req, res);
      return;
    }
    case 'POST': {
      await post(req, res);
      return;
    }
  }
}
