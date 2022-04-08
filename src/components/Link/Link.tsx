import clsx from 'clsx';
import NextLink from 'next/link';
import { ComponentPropsWithoutRef, memo } from 'react';

import styles from './Link.module.scss';

type Props = ComponentPropsWithoutRef<typeof NextLink> & {
  underline?: boolean;
};

export const Link = memo(({ underline, children, ...props }: Props) => {
  return (
    <NextLink {...props}>
      <a className={clsx({ [styles.underline]: underline })}>{children}</a>
    </NextLink>
  );
});
