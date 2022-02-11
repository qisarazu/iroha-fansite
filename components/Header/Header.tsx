import { memo } from 'react';
import { ActiveLink } from '../ActiveLink/ActiveLink';
import styles from './Header.module.scss';

export const Header = memo(function Header() {
  return (
    <header className={styles.root}>
      <ActiveLink href="/" className={styles.link} activeClassName={styles.activeLink}>
        ホーム
      </ActiveLink>
      <ActiveLink href="/singing-streams" className={styles.link} activeClassName={styles.activeLink}>
        歌枠検索
      </ActiveLink>
      <ActiveLink href="/about" className={styles.link} activeClassName={styles.activeLink}>
        当サイトについて
      </ActiveLink>
    </header>
  );
});
