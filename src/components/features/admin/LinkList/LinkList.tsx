import { List, ListItem } from '@mui/material';
import { memo } from 'react';

import { Link } from '../../../Link/Link';

export const LinkList = memo(() => {
  return (
    <List>
      {[
        { label: 'videos', link: '/admin/videos' },
        { label: 'songs', link: '/admin/songs' },
        { label: 'singing-streams', link: '/admin/singing-streams' },
      ].map((item) => (
        <ListItem key={item.link}>
          <Link href={item.link}>{item.label}</Link>
        </ListItem>
      ))}
    </List>
  );
});
