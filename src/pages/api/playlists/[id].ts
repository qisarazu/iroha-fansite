import type { Playlist } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '../../../lib/supabase';

type GetPlaylistRequest = Pick<Playlist, 'id'>;
const getPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await supabase.auth.api.getUserByCookie(req, res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.query as GetPlaylistRequest;
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
    return;
  }

  const playlist = await prisma.playlist.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      items: {
        include: {
          video: true,
          song: true,
        },
      },
    },
  });
  if (!playlist) {
    res.status(404).json({ error: 'Playlist not found' });
    return;
  }

  res.status(200).json({ data: playlist });
};

type DeletePlaylistRequest = Pick<Playlist, 'id'>;
const deletePlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await supabase.auth.api.getUserByCookie(req, res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.query as DeletePlaylistRequest;
  if (!id) {
    res.status(400).json({ error: 'Missing playlist id' });
    return;
  }

  await prisma.playlist.delete({
    where: {
      id,
    },
  });

  res.status(200).json({ data: { id } });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getPlaylist(req, res);
    case 'DELETE':
      return deletePlaylist(req, res);
  }
}
