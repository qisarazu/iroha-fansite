import { Link as MuiLink } from '@mui/material';
import clsx from 'clsx';
import NextLink from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Link.module.scss';

type Props = ComponentPropsWithoutRef<typeof NextLink> & {
  underline?: boolean;
};

export function Link({ underline, children, ...props }: Props) {
  return (
    <NextLink {...props} passHref legacyBehavior>
      <MuiLink className={clsx({ [styles.underline]: underline })}>{children}</MuiLink>
    </NextLink>
  );
}
