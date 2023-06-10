import type { Playlist, PlaylistItem, SingingStream } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ApiError, badRequest, internalServerError, notFound } from '../../lib/api/ApiError';
import { prisma } from '../../lib/prisma';

export async function getPlaylists(ownerId: string) {
  try {
    return prisma.playlist.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailURLs: true,
        items: {
          select: {
            musicId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to get playlists`);
    }
    throw internalServerError(`Failed to get playlists`);
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
          orderBy: {
            position: 'asc',
          },
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
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to get playlist details`);
    }
    throw internalServerError(`Failed to get playlist details`);
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
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to create playlist`);
    }
    throw internalServerError(`Failed to create playlist`);
  }
}

export async function editPlaylist(
  id: Playlist['id'],
  data: Pick<Playlist, 'title' | 'description'>,
  ownerId: Playlist['ownerId'],
) {
  try {
    const target = await prisma.playlist.findFirst({
      where: { id, ownerId },
    });

    if (!target) {
      throw notFound();
    }

    return prisma.playlist.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to edit playlist`);
    }
    throw internalServerError(`Failed to edit playlist`);
  }
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
      throw notFound();
    }

    await prisma.playlist.delete({
      where: { id: target.id },
    });
    return target;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to delete playlist`);
    }
    throw internalServerError(`Failed to delete playlist`);
  }
}

export async function updatePlaylistThumbnailURLs(playlistId: Playlist['id']) {
  try {
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
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to update playlist thumbnail urls`);
    }
    throw internalServerError(`Failed to update playlist thumbnail urls`);
  }
}

export async function addPlaylistItem(
  playlistId: Playlist['id'],
  musicId: SingingStream['id'],
  ownerId: Playlist['ownerId'],
) {
  try {
    const target = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        ownerId,
      },
    });

    if (!target) {
      throw notFound();
    }

    const itemCount = await prisma.playlistItem.count({
      where: {
        playlistId,
      },
    });

    return await prisma.playlistItem.create({
      data: {
        playlistId,
        musicId,
        position: itemCount + 1,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw badRequest('ItemAlreadyExists');
      }
      throw internalServerError(`${[error.code]} Failed to add playlist item`);
    }
    throw internalServerError('Failed to add playlist item');
  }
}

export async function deletePlaylistItem(
  playlistId: Playlist['id'],
  itemId: PlaylistItem['id'],
  ownerId: Playlist['ownerId'],
) {
  try {
    const targetPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        ownerId,
      },
    });

    if (!targetPlaylist) {
      throw notFound();
    }

    const itemToDelete = await prisma.playlistItem.findUnique({
      where: { id: itemId },
      select: { position: true, music: { select: { video: { select: { thumbnailMediumUrl: true } } } } },
    });

    if (!itemToDelete) {
      throw notFound();
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
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to delete playlist item`);
    }
    throw internalServerError('Failed to delete playlist item');
  }
}

/**
 * プレイリストのアイテムを並び替える
 */
export async function sortPlaylistItems(
  playlistId: Playlist['id'],
  sortedIds: PlaylistItem['id'][],
  ownerId: Playlist['ownerId'],
) {
  try {
    const targetPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        ownerId,
      },
      select: { items: { select: { id: true } } },
    });

    if (!targetPlaylist) {
      throw notFound();
    }

    const validIds = targetPlaylist.items.map((item) => item.id);

    const isValid = sortedIds.length === validIds.length && validIds.every((id) => sortedIds.includes(id));
    if (!isValid) {
      throw badRequest('Invalid playlist item ID');
    }

    return prisma.$transaction(
      sortedIds.map((id, index) =>
        prisma.playlistItem.update({
          where: { id },
          data: { position: index },
        }),
      ),
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to sort playlist items`);
    }
    throw internalServerError('Failed to sort playlist items');
  }
}
