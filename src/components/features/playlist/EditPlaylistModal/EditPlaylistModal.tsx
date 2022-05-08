import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { SingingStream } from '@prisma/client';
import { memo, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useGetSingingStreamsApi } from '../../../../hooks/api/singing-streams/useGetSingingStreamsApi';
import { theme } from '../../../../styles/theme';
import type { PlaylistWithItems } from '../../../../types/Playlist';
import { SingingStreamMediaObject } from '../../singing-stream/SingingSteamMediaObject/SingingStreamMediaObject';

type Props = {
  playlist?: PlaylistWithItems | null;
  open: boolean;
  onSave: (value: { title: string; description?: string; items: SingingStream['id'][] }) => void;
  onClose: () => void;
};

type Form = {
  title: string;
  description?: string | null;
  items: Record<SingingStream['id'], boolean>;
};

export const EditPlaylistModal = memo(({ open, playlist, onSave, onClose }: Props) => {
  const { data: singingStreams } = useGetSingingStreamsApi();
  const { control, register, setValue, reset, handleSubmit } = useForm<Form>();

  const handleSave = useCallback(
    ({ title, description, items }: Form) => {
      onSave({
        title,
        description: description ?? undefined,
        items: Object.keys(items).filter((id) => items[id]),
      });
      onClose();
      reset();
    },
    [onSave, onClose, reset],
  );

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  useEffect(() => {
    if (playlist) {
      setValue('title', playlist.title);
      setValue('description', playlist.description);
      setValue(
        'items',
        playlist.items.reduce<Form['items']>((acc, { id }) => {
          acc[id] = true;
          return acc;
        }, {}) || {},
      );
    }

    () => {
      reset();
    };
  }, [playlist, reset, setValue]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          width: 640,
          maxHeight: 640,
          padding: theme.spacing(2),
          overflowY: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        component={Stack}
      >
        <Typography variant="subtitle1" sx={{ marginBottom: theme.spacing(4) }}>
          編集
        </Typography>

        <Stack spacing={4}>
          <TextField {...register('title')} label="タイトル" variant="standard" />
          <TextField {...register('description')} label="説明" variant="standard" multiline />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ marginTop: theme.spacing(2), marginLeft: 'auto' }}>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSubmit(handleSave)}>保存</Button>
        </Stack>

        <Stack component={FormGroup} divider={<Divider />} spacing={1} sx={{ marginTop: theme.spacing(2) }}>
          {singingStreams.map((singingStream) => (
            <Controller
              name={`items.${singingStream.id}`}
              control={control}
              key={singingStream.id}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  sx={{ margin: 0 }}
                  checked={field.value}
                  control={<Checkbox />}
                  label={<SingingStreamMediaObject singingStream={singingStream} />}
                />
              )}
            />
          ))}
        </Stack>
      </Paper>
    </Modal>
  );
});
