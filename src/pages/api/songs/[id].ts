import type { Song } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../utils/prismaClient';

export type PutSongApiRequest = Partial<Song>;
async function putSong(req: NextApiRequest, res: NextApiResponse<Song>) {
  const body: PutSongApiRequest = req.body;

  const song = await prisma.song.update({
    where: {
      id: body.id,
    },
    data: body,
  });

  res.status(200).json(song);
}

export type DeleteSongApiRequest = Pick<Song, 'id'>;
async function deleteSong(req: NextApiRequest, res: NextApiResponse<Song>) {
  const { id } = req.query as DeleteSongApiRequest;

  const song = await prisma.song.delete({
    where: {
      id,
    },
  });

  res.status(200).json(song);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return putSong(req, res);
    case 'DELETE':
      return deleteSong(req, res);
  }
}
