import type { Session } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import {
  addPlaylistItem,
  sortPlaylistItem,
  updatePlaylistThumbnailURLs,
} from '../../../../../services/playlists/server';
import type { Playlist } from '../../../../../services/playlists/type';
import { withSession } from '../../../../../utils/api/withSession';

type Query = {
  playlistId: Playlist['id'];
};

async function handlePost(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;
  const { musicId } = req.body;

  try {
    const newItem = await addPlaylistItem(playlistId, musicId, session.user.id);

    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { thumbnailURLs: true },
    });

    // プレイリストのサムネイルに利用されているのが 4 つ未満の場合、サムネイル更新
    if (playlist && playlist.thumbnailURLs.length < 4) {
      await updatePlaylistThumbnailURLs(playlistId);
    }

    res.status(200).json({ data: newItem });
  } catch (err) {
    res.status(401).json(err);
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;
  const { sortedIds } = req.body;

  try {
    const data = await sortPlaylistItem(playlistId, sortedIds, session.user.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json(err);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      return withSession(handlePost, req, res);
    }
    case 'PUT': {
      return withSession(handlePut, req, res);
    }
  }
}
