import type { Video } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../lib/prisma';
import type { ApiResponse } from '../../../types/api';
import { asAdminRequireApi } from '../../../utils/asAdminRequireApi';

export type PutVideoApiRequest = Partial<Omit<Video, 'createdAt' | 'updatedAt'>>;
async function putVideo(req: NextApiRequest, res: NextApiResponse<ApiResponse<Video>>) {
  const body: PutVideoApiRequest = req.body;

  const video = await prisma.video.update({
    where: {
      id: body.id,
    },
    data: body,
  });

  res.status(200).json({ data: video });
}

export type DeleteVideoApiRequest = {
  id: string;
};
async function deleteVideo(req: NextApiRequest, res: NextApiResponse<ApiResponse<Video>>) {
  const { id } = req.query as DeleteVideoApiRequest;

  const video = await prisma.video.delete({
    where: {
      id,
    },
  });

  res.status(200).json({ data: video });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT': {
      await asAdminRequireApi(putVideo, req, res);
      return;
    }
    case 'DELETE': {
      await asAdminRequireApi(deleteVideo, req, res);
      return;
    }
  }
}
