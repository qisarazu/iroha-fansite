import { Button, Flex, Textarea, TextInput } from '@mantine/core';
import { useT } from '@transifex/react';
import { useForm } from 'react-hook-form';

import type { Playlist } from '../../../../services/playlists/type';

type Props = {
  mode: 'create' | 'edit';
  onSubmit: (data: FormValue) => void;
  initialValues?: FormValue;
};

type FormValue = {
  title: Playlist['title'];
  description?: Playlist['description'];
};

const MAX_TITLE_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

export function PlaylistForm({ mode, initialValues, onSubmit }: Props) {
  const t = useT();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: initialValues,
  });

  function handleValid(value: FormValue) {
    onSubmit(value);
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleValid)}>
        <TextInput
          mb="xl"
          label={t('タイトル')}
          placeholder={t('タイトル')}
          error={errors.title?.message}
          {...register('title', {
            required: {
              value: true,
              message: t('タイトルは必須です'),
            },
            maxLength: {
              value: MAX_TITLE_LENGTH,
              message: t(`タイトルは最大{maxLength}文字です`, { maxLength: MAX_TITLE_LENGTH }),
            },
          })}
          withAsterisk
        />

        <Textarea
          label={t('説明')}
          placeholder={t('説明')}
          error={errors.description?.message}
          {...register('description', {
            maxLength: {
              value: MAX_DESCRIPTION_LENGTH,
              message: t('説明は最大{maxLength}文字です', { maxLength: MAX_DESCRIPTION_LENGTH }),
            },
          })}
        />

        <Flex justify="flex-end" mt="lg">
          <Button type="submit">{mode === 'create' ? t('作成') : t('保存')}</Button>
        </Flex>
      </form>
    </>
  );
}
