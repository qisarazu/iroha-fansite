import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  CSSObject,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import type { Song, Video } from '@prisma/client';
import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import { MdDelete, MdPlayArrow, MdTimer, MdTimer3 } from 'react-icons/md';
import { v4 as uuid } from 'uuid';

import { useGetSongsApi } from '../../../../hooks/api/songs/useGetSongsApi';
import { useGetVideosApi } from '../../../../hooks/api/videos/useGetVideosApi';
import { useYTPlayer } from '../../../../hooks/useYTPlayer';
import { theme } from '../../../../styles/theme';
import { formatToSec } from '../../../../utils/formatToSec';
import { YTPlayer } from '../../../YTPlayer/YTPlayer';

export type Sing = { id: string; song: Song | null; startSec: number; endSec: number };

type Option<T> = { label: string; value: T };

type Props = {
  open: boolean;
  onSave: (value: { video: Video; sings: Sing[] }) => void;
  onClose: () => void;
};

const modalStyle: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: theme.spacing(120),
  height: theme.spacing(100),
  padding: theme.spacing(2),
  overflowY: 'auto',
};

export const EditSingingStreamModal = memo(({ open, onSave, onClose }: Props) => {
  const { data: videos } = useGetVideosApi();
  const { data: songs } = useGetSongsApi();

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [sings, setSings] = useState<Sing[]>([]);

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

  const { player, ...ytplayerProps } = useYTPlayer({
    mountId: 'preview',
    width: 896,
    height: 504,
    autoplay: false,
    controls: true,
  });

  const onVideoChange = useCallback(
    (_, option: Option<Video> | null) => {
      if (!option) return;
      setSelectedVideo(option.value);
      player?.cueVideoById(option.value.videoId);
    },
    [player],
  );

  const onSongChange = useCallback(
    (singId: string) => (_: unknown, option: Option<Song> | null) => {
      if (!option) return;
      setSings((sings) => sings.map((sing) => (sing.id === singId ? { ...sing, song: option.value } : sing)));
    },
    [],
  );

  const renderInput = useCallback(
    (type: 'video' | 'song') => (params: AutocompleteRenderInputParams) => <TextField {...params} label={type} />,
    [],
  );

  const onStartChange = useCallback(
    (singId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const startSec = formatToSec(event.target.value);
      setSings((sings) => sings.map((sing) => (sing.id === singId ? { ...sing, startSec } : sing)));
    },
    [],
  );

  const onEndChange = useCallback(
    (singId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const endSec = formatToSec(event.target.value);
      setSings((sings) => sings.map((sing) => (sing.id === singId ? { ...sing, endSec } : sing)));
    },
    [],
  );

  const onAddSing = useCallback(() => {
    setSings((state) => [...state, { id: uuid(), song: null, startSec: 0, endSec: 0 }]);
  }, []);

  const onRemoveSing = useCallback(
    (singId: string) => () => {
      setSings((sings) => sings.filter((sing) => sing.id !== singId));
    },
    [],
  );

  const resetState = useCallback(() => {
    setSelectedVideo(null);
    setSings([]);
    player?.stopVideo();
    player?.clearVideo();
  }, [player]);

  const handleClose = useCallback(() => {
    if (sings.length && !confirm('編集中の歌がありますが、編集を中止しますか？')) return;

    onClose();
    resetState();
  }, [onClose, resetState, sings.length]);

  const handleSave = useCallback(() => {
    if (!selectedVideo || !sings.length) return;

    onSave({ video: selectedVideo, sings: sings });
    onClose();
    resetState();
  }, [onClose, onSave, resetState, selectedVideo, sings]);

  const onSingPreview = useCallback(
    (singId: string) => () => {
      if (!player || !selectedVideo) return;
      const sing = sings.find((sing) => sing.id === singId);
      if (!sing) return;
      player.loadVideoById({
        videoId: selectedVideo.videoId,
        startSeconds: sing.startSec,
        endSeconds: sing.endSec,
      });
      player?.playVideo();
    },
    [player, selectedVideo, sings],
  );

  const onTimeWriteClick = useCallback(
    (singId: string, kind: 'startSec' | 'endSec') => () => {
      if (!player) return;

      const currentTime = Math.floor(player.getCurrentTime());
      setSings((sings) => sings.map((sing) => (sing.id === singId ? { ...sing, [kind]: currentTime } : sing)));
    },
    [player],
  );

  const onPlaybackFrom3SecAgoClick = useCallback(
    (singId: string) => () => {
      if (!player || !selectedVideo) return;
      const sing = sings.find((sing) => sing.id === singId);
      if (!sing) return;
      player.loadVideoById({
        videoId: selectedVideo.videoId,
        startSeconds: sing.endSec - 3,
        endSeconds: sing.endSec,
      });
      player?.playVideo();
    },
    [player, selectedVideo, sings],
  );

  return (
    <Modal open={open} onClose={handleClose} keepMounted>
      <Stack component={Paper} sx={modalStyle}>
        <Autocomplete
          sx={{ my: 1 }}
          options={videoOptions}
          value={selectedVideo ? { label: selectedVideo.title, value: selectedVideo } : null}
          renderInput={renderInput('video')}
          onChange={onVideoChange}
        />
        <Stack alignItems="center">
          <YTPlayer {...ytplayerProps} />
        </Stack>

        <Box>
          <Button sx={{ marginTop: 2 }} onClick={onAddSing}>
            歌を追加
          </Button>
        </Box>

        {sings.map((sing) => (
          <Grid container sx={{ my: 1 }} alignItems="center" spacing={1} key={sing.id}>
            <Grid item sm={5}>
              <Autocomplete
                sx={{ flexGrow: 1 }}
                options={songOptions}
                renderInput={renderInput('song')}
                onChange={onSongChange(sing.id)}
              />
            </Grid>
            <Grid item sm={3}>
              <TextField
                type="number"
                label="開始時間"
                value={sing.startSec}
                onChange={onStartChange(sing.id)}
                InputProps={{
                  endAdornment: [
                    <InputAdornment position="end" key="write-start-time">
                      <IconButton onClick={onTimeWriteClick(sing.id, 'startSec')}>
                        <MdTimer />
                      </IconButton>
                    </InputAdornment>,
                    <InputAdornment sx={{ marginLeft: 3 }} position="end" key="preview">
                      <IconButton onClick={onSingPreview(sing.id)}>
                        <MdPlayArrow />
                      </IconButton>
                    </InputAdornment>,
                  ],
                }}
              />
            </Grid>
            <Grid item sm={3}>
              <TextField
                type="number"
                label="終了時間"
                value={sing.endSec}
                onChange={onEndChange(sing.id)}
                InputProps={{
                  endAdornment: [
                    <InputAdornment position="end" key="write-end-time">
                      <IconButton onClick={onTimeWriteClick(sing.id, 'endSec')}>
                        <MdTimer />
                      </IconButton>
                    </InputAdornment>,
                    <InputAdornment sx={{ marginLeft: 3 }} position="end" key="check-before-3s">
                      <IconButton onClick={onPlaybackFrom3SecAgoClick(sing.id)}>
                        <MdTimer3 />
                      </IconButton>
                    </InputAdornment>,
                  ],
                }}
              />
            </Grid>
            <Grid item sm={1}>
              <IconButton onClick={onRemoveSing(sing.id)}>
                <MdDelete />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {/* footer */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing(1), marginTop: 'auto' }}>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleSave}>保存</Button>
        </Box>
      </Stack>
    </Modal>
  );
});
