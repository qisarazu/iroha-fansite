import Head from 'next/head';
import type { ReactNode } from 'react';
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
        <title>{title}</title>
      </Head>
      <section className={`${styles.root} ${className}`}>{children}</section>
    </>
  );
}
