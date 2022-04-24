import type { Song } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../utils/prismaClient';
import { withAdminRequired } from '../../../utils/withAdminRequired';

export type GetSongsApiRequest = {
  orderBy?: keyof Song;
  orderDirection?: 'asc' | 'desc';
};
async function getSongs(req: NextApiRequest, res: NextApiResponse<Song[]>) {
  const { orderBy, orderDirection } = req.query as GetSongsApiRequest;

  const songs = await prisma.song.findMany({
    orderBy: {
      [orderBy || 'title']: orderDirection || 'desc',
    },
  });

  res.status(200).json(songs);
}

export type PostSongApiRequest = Omit<Song, 'id' | 'createdAt' | 'updatedAt'>;
async function postSong(req: NextApiRequest, res: NextApiResponse<Song>) {
  const body: PostSongApiRequest = req.body;

  const song = await prisma.song.create({
    data: body,
  });

  res.status(200).json(song);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSongs(req, res);
    case 'POST':
      return withAdminRequired(postSong, req, res);
  }
}
