import type { Playlist, PlaylistItem } from '@prisma/client';
import type { Session } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { responseError } from '../../../../../lib/api/response-error';
import { deletePlaylistItem, updatePlaylistThumbnailURLs } from '../../../../../services/playlists/server';
import { withSession } from '../../../../../utils/api/withSession';

type Query = {
  playlistId: Playlist['id'];
  itemId: PlaylistItem['id'];
};

async function handleDelete(req: NextApiRequest, res: NextApiResponse, session: Session) {
  const { playlistId, itemId } = req.query as Query;

  const deletedItem = await deletePlaylistItem(playlistId, itemId, session.user.id);

  if (deletedItem) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { thumbnailURLs: true },
    });

    // プレイリストのサムネイルに利用されているアイテムだった場合、サムネイルを更新
    if (playlist && playlist.thumbnailURLs.includes(deletedItem.music.video.thumbnailMediumUrl)) {
      await updatePlaylistThumbnailURLs(playlistId);
    }
  }

  res.status(200).json({ data: { item: deletedItem } });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'DELETE': {
        return await withSession(handleDelete, req, res);
      }
    }
  } catch (error) {
    responseError(res, error);
  }
}
