import type { Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { notFound } from '../../../../lib/api/ApiError';
import { responseError } from '../../../../lib/api/response-error';
import { deletePlaylist, editPlaylist, getPlaylistDetails } from '../../../../services/playlists/server';
import type { Playlist } from '../../../../services/playlists/type';
import { withSession } from '../../../../utils/api/withSession';

type Query = {
  playlistId: Playlist['id'];
};

export async function handleGet(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;
  const playlist = await getPlaylistDetails(playlistId, session.user.id);
  if (!playlist) {
    throw notFound();
  }

  res.status(200).json({ data: playlist });
}

export async function handlePut(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;

  const item = await editPlaylist(playlistId, req.body, session.user.id);
  res.status(200).json({ data: item });
}

export async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;

  const item = await deletePlaylist(playlistId, session.user.id);
  if (!item) {
    throw notFound();
  }

  res.status(200).json({ data: item });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return await withSession(handleGet, req, res);
      case 'PUT':
        return await withSession(handlePut, req, res);
      case 'DELETE':
        return await withSession(handleDelete, req, res);
    }
  } catch (error) {
    responseError(res, error);
  }
}
