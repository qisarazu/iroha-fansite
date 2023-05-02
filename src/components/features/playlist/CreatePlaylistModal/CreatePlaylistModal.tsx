import { Box, Button, Space, Textarea, TextInput } from '@mantine/core';
import type { Playlist } from '@prisma/client';
import { useT } from '@transifex/react';
import { useForm } from 'react-hook-form';

import { useCreatePlaylist } from '../../../../hooks/api/playlists/useCreatePlaylist';

type FormValue = {
  title: Playlist['title'];
  description?: Playlist['description'];
};

const MAX_TITLE_LENGTH = 32;
const MAX_DESCRIPTION_LENGTH = 32;

export function CreatePlaylistModal() {
  const t = useT();
  const create = useCreatePlaylist();

  const { register, handleSubmit } = useForm<FormValue>();

  function handleValid(value: FormValue) {
    create({ title: value.title, description: value.description, items: [] });
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleValid)}>
        <TextInput mb="xl" placeholder={t('タイトル')} {...register('title', { maxLength: MAX_TITLE_LENGTH })} />
        <Textarea placeholder={t('説明')} {...register('description', { maxLength: MAX_DESCRIPTION_LENGTH })} />

        <Box
          sx={(theme) => ({
            display: 'flex',
            gap: theme.spacing.md,
            justifyContent: 'flex-end',
            marginTop: theme.spacing.lg,
          })}
        >
          <Button>{t('キャンセル')}</Button>
          <Button type="submit">{t('保存')}</Button>
        </Box>
      </form>
    </>
  );
}
