import type { Playlist, PlaylistItem, SingingStream } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

  try {
    return await prisma.playlistItem.create({
      data: {
        playlistId,
        musicId,
        position: itemCount + 1,
      },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        throw { error: { message: 'ItemAlreadyExists' } };
      }
    }
    throw err;
  }
}

export async function deletePlaylistItem(
  playlistId: Playlist['id'],
  itemId: PlaylistItem['id'],
  ownerId: Playlist['ownerId'],
) {
  const targetPlaylist = await prisma.playlist.findFirst({
    where: {
      id: playlistId,
      ownerId,
    },
  });

  if (!targetPlaylist) {
    throw { error: { message: 'NotFound' } };
  }

  const itemToDelete = await prisma.playlistItem.findUnique({
    where: { id: itemId },
    select: { position: true, music: { select: { video: { select: { thumbnailMediumUrl: true } } } } },
  });

  if (!itemToDelete) {
    throw { error: { message: 'NotFound' } };
  }

  await prisma.$transaction([
    prisma.playlistItem.updateMany({
      where: {
        playlistId,
        position: { gt: itemToDelete.position },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    }),
    prisma.playlistItem.delete({
      where: { id: itemId },
    }),
  ]);

  return itemToDelete;
}
