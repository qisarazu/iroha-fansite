import type { SingingStream } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../lib/prisma';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { asAdminRequireApi } from '../../../utils/asAdminRequireApi';
import type { ApiResponse, CursorRequest, CursorResponse, Stringify } from './../../../types/api';

export type GetSingingStreamsRequest = CursorRequest & {
  keyword?: string;
  orderBy?: keyof SingingStream;
  orderDirection?: 'asc' | 'desc';
  all?: boolean;
};
async function getSingingStreams(
  req: NextApiRequest,
  res: NextApiResponse<CursorResponse<SingingStreamWithVideoAndSong[]>>,
) {
  const { keyword, cursor, limit, all } = req.query as Stringify<GetSingingStreamsRequest>;

  const parsedLimit = limit ? parseInt(limit, 10) : 50;

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
    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    take: all ? undefined : parsedLimit,
    skip: cursor ? 1 : 0,
  });

  res.status(200).json({
    data: singingStreams,
    nextCursor: singingStreams.at(-1)?.id ?? null,
    hasNext: singingStreams.length === parsedLimit,
  });
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
      return asAdminRequireApi(postSingingStream, req, res);
  }
}
