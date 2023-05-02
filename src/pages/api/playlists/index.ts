import type { Playlist, SingingStream } from '@prisma/client';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../../../lib/prisma';

async function getPlaylists(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    res.status(401).json({ error: { message: 'Unauthorized' } });
    return;
  }

  const items = await prisma.playlist.findMany({
    where: {
      ownerId: session.user.id,
    },
  });

  res.status(200).json({ data: items });
}

export type PostPlaylistRequest = {
  title: Playlist['title'];
  description?: Playlist['description'];
  items: SingingStream['id'][];
};

async function postPlaylist(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { title, description, items } = req.body as PostPlaylistRequest;

  const item = await prisma.playlist.create({
    data: {
      ownerId: session.user.id,
      title,
      description,
      items: {
        connect: items.map((id) => ({
          id,
        })),
      },
    },
  });

  res.status(200).json({ data: item });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      return getPlaylists(req, res);
    }
    case 'POST': {
      return postPlaylist(req, res);
    }
  }
}
