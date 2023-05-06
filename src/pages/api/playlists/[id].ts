import type { Playlist } from '@prisma/client';
import type { Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { deletePlaylist, editPlaylist } from '../../../services/playlists/server';
import { withSession } from '../../../utils/api/withSession';

export type GetPlaylistRequest = {
  id: Playlist['id'];
};

export async function handleGet(req: NextApiRequest, res: NextApiResponse, session: Session) {
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

export async function handlePut(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { id } = req.query as { id: Playlist['id'] };

  try {
    const item = await editPlaylist(id, req.body, session.user.id);
    console.log('debug:item', item);
    res.status(200).json({ data: item });
  } catch (err) {
    res.status(404).json(err);
  }
}

export async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { id } = req.query as { id: Playlist['id'] };

  try {
    const item = await deletePlaylist(id, session.user.id);

    if (!item) {
      return res.status(404).json({ error: { message: 'NotFound' } });
    }

    res.status(200).json({ data: item });
  } catch (err) {
    res.status(404).json(err);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return withSession(handleGet, req, res);
    case 'PUT':
      return withSession(handlePut, req, res);
    case 'DELETE':
      return withSession(handleDelete, req, res);
  }
}
