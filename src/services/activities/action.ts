'use server';

import { ActivityStatus, ActivityType } from '@prisma/client';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import sharp from 'sharp';
import { coerce, custom, nativeEnum, nullable, object, string, type z } from 'zod';

import { createActivity, deleteActivity, type DeleteActivityParams } from './server';

const schema = object({
  status: nativeEnum(ActivityStatus),
  type: nativeEnum(ActivityType),
  title: string().min(1),
  thumbnail: custom<File>(),
  detailURL: string().url(),
  isShowTime: string()
    .optional()
    .transform((str) => str === 'true'),
  startAt: string().pipe(coerce.date()),
  endAt: string().transform((str) => {
    if (str === '') return null;
    return new Date(str);
  }),
  endNote: nullable(string().transform((str) => str || null)),
});

type State = {
  errors?: Partial<Record<keyof z.infer<typeof schema>, string[]>>;
  message: string | null;
};

export async function createActivityAction(_: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'a' };
  }

  const thumbnailBuffer = await validatedFields.data.thumbnail.arrayBuffer();
  const thumbnail = await sharp(thumbnailBuffer).resize({ height: 90, fit: 'contain' }).toFormat('webp').toBuffer();

  const supabase = createServerActionClient({ cookies });

  try {
    const res = await supabase.storage.from('activity-thumbnail').upload(`${nanoid()}.webp`, thumbnail, {
      contentType: 'image/webp',
    });

    if (!res.data?.path) {
      throw new Error('thumbnail does not upload');
    }

    await createActivity({
      status: validatedFields.data.status,
      title: validatedFields.data.title,
      type: validatedFields.data.type,
      thumbnailURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/activity-thumbnail/${res.data.path}`,
      detailURL: validatedFields.data.detailURL,
      isShowTime: validatedFields.data.isShowTime,
      startAt: validatedFields.data.startAt,
      endAt: validatedFields.data.endAt,
      endNote: validatedFields.data.endNote,
    });
    revalidatePath('/adminv2/activity');

    return { errors: {}, message: null };
  } catch (e) {
    console.log(e);
    return {
      message: 'a',
    };
  }
}

export async function deleteActivityAction(params: DeleteActivityParams) {
  await deleteActivity(params);
  revalidatePath('/adminv2/activity');
}
