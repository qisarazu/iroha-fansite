import type { Video } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../utils/prismaClient';

export type PutVideoApiRequest = Partial<Omit<Video, 'createdAt' | 'updatedAt'>>;
async function putVideo(req: NextApiRequest, res: NextApiResponse<Video>) {
  const body: PutVideoApiRequest = req.body;

  const video = await prisma.video.update({
    where: {
      id: body.id,
    },
    data: body,
  });

  res.status(200).json(video);
}

export type DeleteVideoApiRequest = {
  id: string;
};
async function deleteVideo(req: NextApiRequest, res: NextApiResponse<Video>) {
  const { id } = req.query as DeleteVideoApiRequest;

  const video = await prisma.video.delete({
    where: {
      id,
    },
  });

  res.status(200).json(video);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT': {
      await putVideo(req, res);
      return;
    }
    case 'DELETE': {
      await deleteVideo(req, res);
      return;
    }
  }
}
