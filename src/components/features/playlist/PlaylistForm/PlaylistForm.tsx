import { Button, Flex, Textarea, TextInput } from '@mantine/core';
import type { Playlist } from '@prisma/client';
import { useT } from '@transifex/react';
import { useForm } from 'react-hook-form';

type Props = {
  mode: 'create' | 'edit';
  onSubmit: (data: FormValue) => void;
  initialValues?: FormValue;
};

type FormValue = {
  title: Playlist['title'];
  description?: Playlist['description'];
};

const MAX_TITLE_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 32;

export function PlaylistForm({ mode, initialValues, onSubmit }: Props) {
  const t = useT();

  const { register, handleSubmit } = useForm<FormValue>({
    defaultValues: initialValues,
  });

  function handleValid(value: FormValue) {
    onSubmit(value);
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleValid)}>
        <TextInput mb="xl" placeholder={t('タイトル')} {...register('title', { maxLength: MAX_TITLE_LENGTH })} />
        <Textarea placeholder={t('説明')} {...register('description', { maxLength: MAX_DESCRIPTION_LENGTH })} />

        <Flex justify="flex-end" mt="lg">
          <Button type="submit">{mode === 'create' ? t('作成') : t('保存')}</Button>
        </Flex>
      </form>
    </>
  );
}
