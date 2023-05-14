import type { Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createPlaylist, getPlaylists } from '../../../services/playlists/server';
import type { PostPlaylistRequest } from '../../../services/playlists/type';
import { withSession } from '../../../utils/api/withSession';

async function handleGet(_: NextApiRequest, res: NextApiResponse, session: Session) {
  const items = await getPlaylists(session.user.id);

  return res.status(200).json({ data: items });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { title, description } = req.body as PostPlaylistRequest;

  const playlist = await createPlaylist(title, description, session.user.id);
  return res.status(200).json({ data: playlist });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return withSession(handleGet, req, res);
    }
    case 'POST': {
      return withSession(handlePost, req, res);
    }
  }
}
