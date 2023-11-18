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
        <title>{`${title} | gozaru.fans`}</title>
        <meta name="description" content={description ?? DEFAULT_DESCRIPTION} />
        <meta property="og:title" content={`${title} | gozaru.fans`} />
        <meta property="og:description" content={description ?? DEFAULT_DESCRIPTION} />
        <meta property="og:image" content="https://gozaru.fans/api/og" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | gozaru.fans`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://gozaru.fans/api/og" />
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
