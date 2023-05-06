import { Group } from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';
import { IconHome, IconInfoCircle, IconMusic, IconPlaylist } from '@tabler/icons-react';
import { useT } from '@transifex/react';

import { useIsMobile } from '../../hooks/ui/useIsMobile';
import { ActiveLink } from '../ActiveLink/ActiveLink';
import { LoginButton } from '../features/auth/LoginButton/LoginButton';
import { UserIcon } from '../features/auth/UserIcon/UserIcon';
import styles from './Header.module.scss';

export function Header() {
  const t = useT();
  const isMobile = useIsMobile();
  const user = useUser();

  return (
    <Group position="center" pos="relative" mx="auto" py={8} px={16} maw={1320} h={54}>
      <Group spacing="lg">
        <ActiveLink href="/" className={styles.link} activeClassName={styles.activeLink}>
          {isMobile ? <IconHome /> : t('ホーム')}
        </ActiveLink>
        <ActiveLink href="/singing-streams" className={styles.link} activeClassName={styles.activeLink}>
          {isMobile ? <IconMusic /> : t('歌枠検索')}
        </ActiveLink>
        <ActiveLink href="/playlists" className={styles.link} activeClassName={styles.activeLink}>
          {isMobile ? <IconPlaylist /> : t('プレイリスト')}
        </ActiveLink>
        <ActiveLink href="/about" className={styles.link} activeClassName={styles.activeLink}>
          {isMobile ? <IconInfoCircle /> : t('当サイトについて')}
        </ActiveLink>
      </Group>

      {user ? (
        <UserIcon user={user} size={isMobile ? 'sm' : 'md'} pos="absolute" right={16} />
      ) : (
        <LoginButton variant="outline" size={isMobile ? 'xs' : 'md'} pos="absolute" right={16} />
      )}
    </Group>
  );
}
