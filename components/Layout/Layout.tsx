import Head from 'next/head';
import type { ReactNode } from 'react';
import { Header } from '../Header/Header';
import styles from './Layout.module.scss';

type Props = {
  className?: string;
  title: string;
  children: ReactNode;
};

export function Layout({ className, title, children }: Props) {
  return (
    <>
      <Head>
        <title>{title} | gozaru.fans</title>
      </Head>
      <div>
        <Header />
        <section className={`${styles.root} ${className}`}>{children}</section>
      </div>
    </>
  );
}
