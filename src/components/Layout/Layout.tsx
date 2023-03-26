import { useT } from '@transifex/react';
import clsx from 'clsx';
import Head from 'next/head';
import { memo, type ReactNode } from 'react';

import { Header } from '../Header/Header';
import styles from './Layout.module.scss';

type Props = {
  className?: string;
  title: string;
  description?: string;
  padding?: 'all' | 'vertical' | 'horizontal' | 'none';
  children: ReactNode;
};

export const Layout = memo(function Layout({ className, title, description, padding = 'all', children }: Props) {
  const t = useT();
  const DEFAULT_DESCRIPTION = t(
    'gozaru.fans はホロライブ6期生 (holoX) の用心棒、風真いろはさんの非公式ファンサイトです。',
    { _context: 'meta', _comment: 'The default meta description' },
  );
  return (
    <>
      <Head>
        <title>{title} | gozaru.fans</title>
        <meta name="description" content={description ?? DEFAULT_DESCRIPTION} />
      </Head>
      <div>
        <Header />
        <section className={clsx(styles.root, className, { [styles[padding]]: padding !== 'none' })}>
          {children}
        </section>
      </div>
    </>
  );
});
