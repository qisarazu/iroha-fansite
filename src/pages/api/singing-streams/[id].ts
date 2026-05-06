import type { SingingStream } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { responseError } from '../../../lib/api/response-error';
import { prisma } from '../../../lib/prisma';
import type { ApiResponse } from '../../../types/api';
import type { SingingStreamWithVideoAndSong } from '../../../types/SingingStream';
import { asAdminRequireApi } from '../../../utils/asAdminRequireApi';

export type GetSingingStreamRequest = Pick<SingingStream, 'id'>;
async function getSingingStream(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SingingStreamWithVideoAndSong | null>>,
) {
  const { id } = req.query as GetSingingStreamRequest;

  const singingStream = await prisma.singingStream.findFirst({
    where: {
      id,
    },
    include: {
      video: true,
      song: true,
    },
  });

  res.status(200).json({ data: singingStream });
}

export type PutSingingStreamRequest = Partial<SingingStream>;
async function putSingingStream(req: NextApiRequest, res: NextApiResponse<ApiResponse<SingingStreamWithVideoAndSong>>) {
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

  res.status(200).json({ data: singingStream });
}

export type DeleteSingingStream = Pick<SingingStream, 'id'>;
async function deleteSingingStream(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SingingStreamWithVideoAndSong>>,
) {
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

  res.status(200).json({ data: singingStream });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        return await getSingingStream(req, res);
      }
      case 'PUT': {
        return await asAdminRequireApi(putSingingStream, req, res);
      }
      case 'DELETE': {
        return await asAdminRequireApi(deleteSingingStream, req, res);
      }
    }
  } catch (error) {
    return responseError(res, error);
  }
}
