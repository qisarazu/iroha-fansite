import type { Song } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../lib/prisma';
import type { ApiResponse } from '../../../types/api';
import { withAdminRequired } from '../../../utils/withAdminRequired';

export type PutSongApiRequest = Partial<Song>;
async function putSong(req: NextApiRequest, res: NextApiResponse<ApiResponse<Song>>) {
  const body: PutSongApiRequest = req.body;

  const song = await prisma.song.update({
    where: {
      id: body.id,
    },
    data: body,
  });

  res.status(200).json({ data: song });
}

export type DeleteSongApiRequest = Pick<Song, 'id'>;
async function deleteSong(req: NextApiRequest, res: NextApiResponse<ApiResponse<Song>>) {
  const { id } = req.query as DeleteSongApiRequest;

  const song = await prisma.song.delete({
    where: {
      id,
    },
  });

  res.status(200).json({ data: song });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return withAdminRequired(putSong, req, res);
    case 'DELETE':
      return withAdminRequired(deleteSong, req, res);
  }
}
