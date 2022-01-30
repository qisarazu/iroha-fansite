import Head from 'next/head';
import { memo, ReactNode } from 'react';
import { Header } from '../Header/Header';
import styles from './Layout.module.scss';

type Props = {
  className?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

const DEFAULT_DESCRIPTION =
  'gozaru.fans はホロライブ6期生 (holoX) の用心棒、風真いろはさんの非公式ファンサイトです。';

export const Layout = memo(function Layout({ className, title, description, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} | gozaru.fans</title>
        <meta name="description" content={description ?? DEFAULT_DESCRIPTION} />
      </Head>
      <div>
        <Header />
        <section className={`${styles.root} ${className}`}>{children}</section>
      </div>
    </>
  );
});
