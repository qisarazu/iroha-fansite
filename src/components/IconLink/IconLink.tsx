import clsx from 'clsx';
import { ComponentPropsWithoutRef, memo } from 'react';
import type { IconType } from 'react-icons';

import styles from './IconLink.module.scss';

type Props = ComponentPropsWithoutRef<'a'> & {
  Icon: IconType;
};

export const IconLink = memo(function IconLink({ className, Icon, children, ...props }: Props) {
  return (
    <a {...props} className={clsx(styles.root, className)}>
      <Icon />
      {children}
    </a>
  );
});
