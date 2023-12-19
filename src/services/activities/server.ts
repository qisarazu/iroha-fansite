import type { Activity, ActivityStatus, ActivityType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { internalServerError } from '../../lib/api/ApiError';
import { prisma } from '../../lib/prisma';

const selectValue: Record<keyof Activity, boolean> = {
  id: true,
  status: true,
  type: true,
  title: true,
  isShowTime: true,
  startAt: true,
  endAt: true,
  endNote: true,
  thumbnailURL: true,
  detailURL: true,
  createdAt: false,
  updatedAt: false,
};

type GetActivitiesParams = {
  status?: ActivityStatus[];
  type?: ActivityType[];
  within?: boolean;
};
export async function getActivities(params?: GetActivitiesParams) {
  const withinQuery = params?.within
    ? {
        OR: [
          {
            endAt: {
              equals: null,
            },
          },
          {
            endAt: {
              gte: new Date(),
            },
          },
        ],
      }
    : null;

  try {
    return await prisma.activity.findMany({
      select: selectValue,
      where: {
        status: {
          in: params?.status,
        },
        type: {
          in: params?.type,
        },
        ...withinQuery,
      },
      orderBy: {
        endAt: 'asc',
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to get activities`);
    }
    throw internalServerError(`Failed to get activities. ${error}`);
  }
}

export type CreateActivityParams = Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>;
export async function createActivity(params: CreateActivityParams) {
  try {
    return await prisma.activity.create({
      data: params,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to create activity`);
    }
    throw internalServerError(`Failed to create activity. ${error}`);
  }
}

export type DeleteActivityParams = Pick<Activity, 'id'>;
export async function deleteActivity(params: DeleteActivityParams) {
  try {
    return await prisma.activity.delete({
      where: {
        id: params.id,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to delete activity`);
    }
    throw internalServerError(`Failed to delete activity`);
  }
}

export type UpdateActivityParams = Pick<Activity, 'id'> & Partial<Omit<Activity, 'createdAt' | 'updatedAt'>>;
export async function updateActivity(params: UpdateActivityParams) {
  const { id, ...updatedData } = params;
  try {
    return await prisma.activity.update({
      where: {
        id,
      },
      data: updatedData,
      select: selectValue,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw internalServerError(`${[error.code]} Failed to update activity`);
    }
    throw internalServerError(`Failed to update activity`);
  }
}
