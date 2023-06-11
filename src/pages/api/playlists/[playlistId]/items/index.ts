import type { Session } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { responseError } from '../../../../../lib/api/response-error';
import { prisma } from '../../../../../lib/prisma';
import {
  addPlaylistItem,
  sortPlaylistItems,
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
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId } = req.query as Query;
  const { sortedIds } = req.body;

  const data = await sortPlaylistItems(playlistId, sortedIds, session.user.id);
  res.status(200).json({ data });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        return await withSession(handlePost, req, res);
      }
      case 'PUT': {
        return await withSession(handlePut, req, res);
      }
    }
  } catch (error) {
    responseError(res, error);
  }
}
