import {
  Autocomplete,
  AutocompleteGroupedOption,
  AutocompleteRenderInputParams,
  Box,
  Button,
  CSSObject,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { Song, Video } from '@prisma/client';
import { memo, useCallback, useMemo, useState } from 'react';

import { useGetSongsApi } from '../../../../hooks/api/songs/useGetSongsApi';
import { useGetVideosApi } from '../../../../hooks/api/videos/useGetVideosApi';
import { theme } from '../../../../styles/theme';

type Option<T> = { label: string; value: T };

type Props = {
  open: boolean;
  onSave: (value: { video: Video; song: Song }) => void;
  onClose: () => void;
};

const modalStyle: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: theme.spacing(50),
  padding: theme.spacing(2),
};

export const EditSingingStreamModal = memo(({ open, onSave, onClose }: Props) => {
  const { data: videos } = useGetVideosApi();
  const { data: songs } = useGetSongsApi();

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const videoOptions: Option<Video>[] = useMemo(() => {
    return (
      videos?.map((video) => ({
        label: video.title,
        value: video,
      })) ?? []
    );
  }, [videos]);

  const songOptions: Option<Song>[] = useMemo(() => {
    return (
      songs?.map((song) => ({
        label: `${song.title} / ${song.artist}`,
        value: song,
      })) ?? []
    );
  }, [songs]);

  const onVideoChange = useCallback((_, option: Option<Video> | null) => {
    option && setSelectedVideo(option.value);
  }, []);

  const onSongChange = useCallback((_, option: Option<Song> | null) => {
    option && setSelectedSong(option.value);
  }, []);

  const renderInput = useCallback(
    (type: 'video' | 'song') => (params: AutocompleteRenderInputParams) => <TextField {...params} label={type} />,
    [],
  );

  const handleSave = useCallback(() => {
    if (!selectedVideo || !selectedSong) return;
    onClose();
    onSave({ video: selectedVideo, song: selectedSong });
  }, [onClose, onSave, selectedSong, selectedVideo]);

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={modalStyle}>
        <Autocomplete
          sx={{ my: 1 }}
          options={videoOptions}
          renderInput={renderInput('video')}
          onChange={onVideoChange}
        />
        <Autocomplete sx={{ my: 1 }} options={songOptions} renderInput={renderInput('song')} onChange={onSongChange} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing(1) }}>
          <Button onClick={onClose}>キャンセル</Button>
          <Button onClick={handleSave}>保存</Button>
        </Box>
      </Paper>
    </Modal>
  );
});
