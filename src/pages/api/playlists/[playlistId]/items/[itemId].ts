import type { Playlist, PlaylistItem } from '@prisma/client';
import type { Session } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { deletePlaylistItem } from '../../../../../services/playlists/server';
import { withSession } from '../../../../../utils/api/withSession';

type Query = {
  playlistId: Playlist['id'];
  itemId: PlaylistItem['id'];
};

async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId, itemId } = req.query as Query;

  try {
    const item = await deletePlaylistItem(playlistId, itemId, session.user.id);
    res.status(200).json({ data: { item } });
  } catch (err) {
    res.status(500).json(err);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'DELETE': {
      return withSession(handleDelete, req, res);
    }
  }
}
