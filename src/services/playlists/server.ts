import type { Playlist, SingingStream } from '@prisma/client';

import { prisma } from '../../lib/prisma';

export async function getPlaylists(ownerId: string) {
  try {
    return prisma.playlist.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error getting playlists:', error);
    throw error;
  }
}

export async function getPlaylistDetails(id: string, ownerId: string) {
  try {
    const playlist = await prisma.playlist.findFirst({
      where: {
        id,
        ownerId,
      },
      include: {
        items: {
          include: {
            music: {
              include: {
                song: true,
                video: true,
              },
            },
          },
        },
      },
    });

    return playlist;
  } catch (error) {
    console.error('Error getting playlist details:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createPlaylist(title: string, description: string | null | undefined, ownerId: string) {
  try {
    const playlist = await prisma.playlist.create({
      data: {
        title,
        description,
        ownerId,
        items: {
          create: [],
        },
      },
      include: {
        items: true,
      },
    });

    return playlist;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

export async function editPlaylist(
  id: Playlist['id'],
  data: Pick<Playlist, 'title' | 'description'>,
  ownerId: Playlist['ownerId'],
) {
  const target = await prisma.playlist.findFirst({
    where: { id, ownerId },
  });
  console.log('debug:target', target);
  if (!target) {
    throw { error: { message: 'NotFound' } };
  }

  return prisma.playlist.update({
    where: { id },
    data,
  });
}

export async function deletePlaylist(id: Playlist['id'], ownerId: Playlist['ownerId']) {
  try {
    const target = await prisma.playlist.findFirst({
      where: {
        id,
        ownerId,
      },
    });
    if (!target) {
      throw { error: { message: 'NotFound' } };
    }

    await prisma.playlist.delete({
      where: { id: target.id },
    });
    return target;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}

export async function addPlaylistItem(
  playlistId: Playlist['id'],
  musicId: SingingStream['id'],
  ownerId: Playlist['ownerId'],
) {
  const target = await prisma.playlist.findFirst({
    where: {
      id: playlistId,
      ownerId,
    },
  });

  if (!target) {
    throw { error: { message: 'NotFound' } };
  }

  const itemCount = await prisma.playlistItem.count({
    where: {
      playlistId,
    },
  });

  return prisma.playlistItem.create({
    data: {
      playlistId,
      musicId: musicId,
      position: itemCount + 1,
    },
  });
}

export async function updatePlaylistThumbnailURLs(playlistId: Playlist['id']) {
  const playlistItems = await prisma.playlistItem.findMany({
    where: { playlistId },
    orderBy: { createdAt: 'asc' },
    select: {
      music: {
        select: {
          video: {
            select: { thumbnailMediumUrl: true },
          },
        },
      },
    },
  });

  const uniqueThumbnails = Array.from(new Set(playlistItems.map((item) => item.music.video.thumbnailMediumUrl)));

  const thumbnailURLs = uniqueThumbnails.length
    ? uniqueThumbnails.length < 4
      ? [uniqueThumbnails[0]]
      : uniqueThumbnails.slice(0, 4)
    : [];

  await prisma.playlist.update({
    where: { id: playlistId },
    data: { thumbnailURLs },
  });
}
