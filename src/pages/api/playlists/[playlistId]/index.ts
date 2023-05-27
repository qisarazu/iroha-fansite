import type { Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { deletePlaylist, editPlaylist, getPlaylistDetails } from '../../../../services/playlists/server';
import type { Playlist } from '../../../../services/playlists/type';
import { withSession } from '../../../../utils/api/withSession';

type Query = {
  playlistId: Playlist['id'];
};

export async function handleGet(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;
  try {
    const playlist = await getPlaylistDetails(playlistId, session.user.id);
    res.status(200).json({ data: playlist });
  } catch (err) {
    res.status(500).json(err);
  }
}

export async function handlePut(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;

  try {
    const item = await editPlaylist(playlistId, req.body, session.user.id);
    res.status(200).json({ data: item });
  } catch (err) {
    res.status(404).json(err);
  }
}

export async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;

  try {
    const item = await deletePlaylist(playlistId, session.user.id);

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
