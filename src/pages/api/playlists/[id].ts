import type { Playlist } from '@prisma/client';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { withSession } from '../../../utils/api/withSession';

export type GetPlaylistRequest = {
  id: Playlist['id'];
};

export async function getPlaylist(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { id } = req.query as GetPlaylistRequest;
  const item = await prisma.playlist.findFirst({
    where: {
      id,
      ownerId: session.user.id,
    },
  });

  if (!item) {
    return res.status(404).json({ error: { message: 'NotFound' } });
  }

  res.status(200).json({ data: item });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return withSession(getPlaylist, req, res);
  }
}
