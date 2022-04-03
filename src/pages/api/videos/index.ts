import type { Video } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../utils/prismaClient';

export type GetVideosApiRequest = {
  orderBy?: keyof Video;
  orderDirection?: 'asc' | 'desc';
};
async function getVideos(req: NextApiRequest, res: NextApiResponse<Video[]>) {
  const { orderBy, orderDirection } = req.query as GetVideosApiRequest;

  const videos = await prisma.video.findMany({
    orderBy: {
      [orderBy || 'publishedAt']: orderDirection || 'desc',
    },
  });

  res.status(200).json(videos);
}

export type PostVideoApiRequest = Omit<Video, 'id' | 'createdAt' | 'updatedAt'>;
async function postVideo(req: NextApiRequest, res: NextApiResponse<Video>) {
  const body: PostVideoApiRequest = req.body;

  const video = await prisma.video.create({
    data: body,
  });

  res.status(200).json(video);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      await getVideos(req, res);
      return;
    }
    case 'POST': {
      await postVideo(req, res);
      return;
    }
  }
}
