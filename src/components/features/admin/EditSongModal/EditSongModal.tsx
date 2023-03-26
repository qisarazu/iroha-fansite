import { Button, type CSSObject, Input, Modal, Paper, Stack } from '@mui/material';
import type { Song } from '@prisma/client';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { muiTheme } from '../../../../styles/theme';

type Props = {
  open: boolean;
  onSave: (song: Pick<Song, 'title' | 'artist'>) => void;
  onClose: () => void;
};

type FormType = Pick<Song, 'title' | 'artist'>;

const modalStyle: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: muiTheme.spacing(120),
  height: muiTheme.spacing(32),
  padding: muiTheme.spacing(2),
  overflowY: 'auto',
};

export const EditSongModal = ({ open, onSave, onClose }: Props) => {
  const { control, handleSubmit, reset } = useForm<FormType>({ defaultValues: { title: '', artist: '' } });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [reset, open]);

  return (
    <Modal open={open}>
      <Stack component={Paper} sx={modalStyle}>
        <Stack spacing={4}>
          <Controller name="title" control={control} render={({ field }) => <Input {...field} placeholder="曲名" />} />
          <Controller
            name="artist"
            control={control}
            render={({ field }) => <Input {...field} placeholder="アーティスト名" />}
          />
        </Stack>
        <Stack direction="row" spacing={4} sx={{ marginTop: 'auto' }}>
          <Button sx={{ marginLeft: 'auto' }} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSave)}>Save</Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
