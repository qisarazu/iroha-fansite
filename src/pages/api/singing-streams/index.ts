import type { NextApiRequest, NextApiResponse } from 'next';

import type { SingingStream, SingingStreamWithVideoAndSong } from '../../../model';
import { prisma } from '../../../utils/prismaClient';

export type GetSingingStreamsRequest = {
  orderBy?: keyof SingingStream;
  orderDirection?: 'asc' | 'desc';
};
async function getSingingStreams(req: NextApiRequest, res: NextApiResponse<SingingStreamWithVideoAndSong[]>) {
  const { orderBy, orderDirection } = req.query as GetSingingStreamsRequest;

  const singingStreams = await prisma.singingStream.findMany({
    orderBy: {
      [orderBy || 'title']: orderDirection || 'desc',
    },
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json(singingStreams);
}

export type PostSingingStreamRequest = Omit<SingingStream, 'id' | 'createdAt' | 'updatedAt' | 'video' | 'song'>;
async function postSingingStream(req: NextApiRequest, res: NextApiResponse<SingingStreamWithVideoAndSong>) {
  const body: PostSingingStreamRequest = req.body;

  const singingStream = await prisma.singingStream.create({
    data: body,
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json(singingStream);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSingingStreams(req, res);
    case 'POST':
      return postSingingStream(req, res);
  }
}
