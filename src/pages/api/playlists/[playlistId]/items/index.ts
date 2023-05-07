import type { Playlist } from '@prisma/client';
import type { Session } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { addPlaylistItem, updatePlaylistThumbnailURLs } from '../../../../../services/playlists/server';
import { withSession } from '../../../../../utils/api/withSession';

type Query = {
  playlistId: Playlist['id'];
};

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;
  const { musicId } = req.body;

  try {
    const newItem = await addPlaylistItem(playlistId, musicId, session.user.id);

    await updatePlaylistThumbnailURLs(playlistId);

    res.status(200).json({ data: newItem });
  } catch (err) {
    res.status(401).json(err);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      return withSession(handlePost, req, res);
    }
  }
}