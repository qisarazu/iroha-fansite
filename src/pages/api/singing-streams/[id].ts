import type { NextApiRequest, NextApiResponse } from 'next';

import type { SingingStream, SingingStreamWithVideoAndSong } from '../../../model';
import { prisma } from '../../../utils/prismaClient';

export type PutSingingStreamRequest = Partial<SingingStream>;
async function putSingingStream(req: NextApiRequest, res: NextApiResponse<SingingStreamWithVideoAndSong>) {
  const body: PutSingingStreamRequest = req.body;

  const singingStream = await prisma.singingStream.update({
    where: {
      id: body.id,
    },
    data: body,
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json(singingStream);
}

export type DeleteSingingStream = Pick<SingingStream, 'id'>;
async function deleteSingingStream(req: NextApiRequest, res: NextApiResponse<SingingStreamWithVideoAndSong>) {
  const { id } = req.query as DeleteSingingStream;

  const singingStream = await prisma.singingStream.delete({
    where: {
      id,
    },
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json(singingStream);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT': {
      return putSingingStream(req, res);
    }
    case 'DELETE': {
      return deleteSingingStream(req, res);
    }
  }
}
