import type { Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { notFound } from '../../../lib/api/ApiError';
import { responseError } from '../../../lib/api/response-error';
import { createPlaylist, getPlaylists } from '../../../services/playlists/server';
import type { PostPlaylistRequest } from '../../../services/playlists/type';
import { withSession } from '../../../utils/api/withSession';

async function handleGet(_: NextApiRequest, res: NextApiResponse, session: Session) {
  const playlists = await getPlaylists(session.user.id);
  if (!playlists) {
    throw notFound();
  }

  return res.status(200).json({ data: playlists });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { title, description } = req.body as PostPlaylistRequest;

  const playlist = await createPlaylist(title, description, session.user.id);
  return res.status(200).json({ data: playlist });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        return await withSession(handleGet, req, res);
      }
      case 'POST': {
        return await withSession(handlePost, req, res);
      }
    }
  } catch (error) {
    responseError(res, error);
  }
}
