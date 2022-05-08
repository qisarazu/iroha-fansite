import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, MouseEvent, useCallback, useState } from 'react';
import { MdDelete, MdEditNote, MdMoreVert } from 'react-icons/md';
import urlcat from 'urlcat';

import type { PlaylistWithItems } from '../../../../types/Playlist';

type Props = {
  playlist: PlaylistWithItems;
  onEdit: (playlist: PlaylistWithItems) => void;
  onDelete: (id: PlaylistWithItems['id']) => void;
};

export const PlaylistCard = memo(({ playlist, onEdit, onDelete }: Props) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePlay = useCallback(() => {
    const watchPath = urlcat('/singing-streams/watch', { v: playlist.items[0].id, playlist: playlist.id });
    router.push(watchPath);
  }, [playlist.items, playlist.id, router]);

  const handleActionClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleEdit = useCallback(() => {
    onEdit(playlist);
  }, [onEdit, playlist]);

  const handleDelete = useCallback(() => {
    onDelete(playlist.id);
  }, [onDelete, playlist.id]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Card>
      <CardMedia>
        <Image
          src={'https://i.ytimg.com/vi/TtA8WD-kncA/hqdefault.jpg'}
          alt={playlist.title}
          width={256}
          height={144}
          objectFit="cover"
        />
      </CardMedia>
      <CardHeader
        title={playlist.title || 'a'}
        subheader={playlist.description || 'a'}
        action={
          <IconButton onClick={handleActionClick}>
            <MdMoreVert />
          </IconButton>
        }
      />
      <CardActions sx={{ marginTop: 'auto' }}>
        <Button onClick={handlePlay}>再生</Button>
        <Button>シャッフル</Button>
      </CardActions>
      <CardMenu
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={handleClose}
      />
    </Card>
  );
});

const CardMenu = ({
  open,
  anchorEl,
  onEdit,
  onDelete,
  onClose,
}: {
  open: boolean;
  anchorEl: HTMLElement | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) => {
  return (
    <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
      <MenuItem onClick={onEdit}>
        <ListItemIcon>
          <MdEditNote />
        </ListItemIcon>
        <ListItemText>編集</ListItemText>
      </MenuItem>
      <MenuItem onClick={onDelete}>
        <ListItemIcon>
          <MdDelete />
        </ListItemIcon>
        <ListItemText>削除</ListItemText>
      </MenuItem>
    </Menu>
  );
};
