import type { Playlist } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { supabase } from '../../../lib/supabase';
import { prisma } from './../../../lib/prisma';

const getPlaylists = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await supabase.auth.api.getUserByCookie(req, res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const playlists = await prisma.playlist.findMany({
    where: {
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
    orderBy: {
      createdAt: 'desc',
    },
  });
  res.status(200).json({ data: playlists });
};

type PostPlaylistRequest = Pick<Playlist, 'title' | 'description'> & {
  items: string[];
};
const postPlaylist = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await supabase.auth.api.getUserByCookie(req, res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { title, description, items } = req.body as PostPlaylistRequest;
  const playlist = await prisma.playlist.create({
    data: {
      title,
      description,
      userId: user.id,
      items: {
        connect: items.map((item) => ({
          id: item,
        })),
      },
    },
  });
  res.status(200).json({ data: playlist });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getPlaylists(req, res);
    case 'POST':
      return postPlaylist(req, res);
  }
}
