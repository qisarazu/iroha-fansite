import {
  Box,
  Button,
  CSSObject,
  Grid,
  Input,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useYouTubeVideoApiFetcher } from '../../../../hooks/api/youtube/useGetYouTubeVideoApi';
import type { GetYouTubeVideoResponse } from '../../../../pages/api/youtube/videos/[id]';
import { muiTheme } from '../../../../styles/theme';

type Props = {
  open: boolean;
  onSave: (video: GetYouTubeVideoResponse) => void;
  onClose: () => void;
};

type FormType = {
  idOrUrl: string;
};

const modalStyle: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: muiTheme.spacing(120),
  height: muiTheme.spacing(48),
  padding: muiTheme.spacing(2),
  overflowY: 'auto',
};

export const EditVideoModal = ({ open, onSave, onClose }: Props) => {
  const { control, handleSubmit, reset } = useForm<FormType>({ defaultValues: { idOrUrl: '' } });
  const youtubeApiFetcher = useYouTubeVideoApiFetcher();

  const [videoData, setVideoData] = useState<GetYouTubeVideoResponse>();

  const onSearch = useCallback(
    async ({ idOrUrl }: FormType) => {
      const videoId = idOrUrl.includes('https')
        ? idOrUrl.match(/https:\/\/www\.youtube\.com\/watch\?v=(.*)/)?.[1]
        : idOrUrl;
      if (!videoId) {
        throw new Error(`URL is not a valid: ${videoId}`);
      }
      const data = await youtubeApiFetcher(videoId);
      setVideoData(data);
    },
    [youtubeApiFetcher],
  );

  const handleSave = useCallback(() => {
    if (!videoData) return;

    onSave(videoData);
  }, [onSave, videoData]);

  useEffect(() => {
    if (!open) {
      reset();
      setVideoData(undefined);
    }
  }, [open, reset]);

  return (
    <Modal open={open}>
      <Stack component={Paper} sx={modalStyle} spacing={2}>
        <Stack direction="row" spacing={4}>
          <Controller
            name="idOrUrl"
            control={control}
            render={({ field }) => <Input {...field} placeholder="動画ID or URL" sx={{ flexGrow: 1 }} />}
          />
          <Button onClick={handleSubmit(onSearch)}>検索</Button>
        </Stack>
        <Box sx={{ flexGrow: 1 }}>
          {videoData ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>サムネイル</TableCell>
                  <TableCell>タイトル</TableCell>
                  <TableCell>動画長</TableCell>
                  <TableCell>公開日</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Image
                      src={videoData.thumbnails.medium}
                      alt={videoData.title}
                      width={160}
                      height={90}
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                  </TableCell>
                  <TableCell>{videoData.title}</TableCell>
                  <TableCell>{videoData.duration}</TableCell>
                  <TableCell>{format(new Date(videoData.publishedAt), 'yyyy/MM/dd HH:mm')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : null}
        </Box>
        <Stack direction="row" spacing={4}>
          <Button sx={{ marginLeft: 'auto' }} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!videoData}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
