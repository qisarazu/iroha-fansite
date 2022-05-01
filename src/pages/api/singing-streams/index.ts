import type { SingingStream } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../lib/prisma';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { withAdminRequired } from '../../../utils/withAdminRequired';
import type { ApiResponse } from './../../../types/api';

export type GetSingingStreamsRequest = {
  keyword?: string;
  orderBy?: keyof SingingStream;
  orderDirection?: 'asc' | 'desc';
};
async function getSingingStreams(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SingingStreamWithVideoAndSong[]>>,
) {
  const { keyword } = req.query as GetSingingStreamsRequest;

  const singingStreams = await prisma.singingStream.findMany({
    orderBy: [
      {
        video: { publishedAt: 'desc' },
      },
      { start: 'asc' },
    ],
    where: {
      song: {
        title: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    },
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json({ data: singingStreams });
}

export type PostSingingStreamRequest = Omit<SingingStream, 'id' | 'createdAt' | 'updatedAt' | 'video' | 'song'>;
async function postSingingStream(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SingingStreamWithVideoAndSong>>,
) {
  const body: PostSingingStreamRequest = req.body;

  const singingStream = await prisma.singingStream.create({
    data: body,
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json({ data: singingStream });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSingingStreams(req, res);
    case 'POST':
      return withAdminRequired(postSingingStream, req, res);
  }
}
