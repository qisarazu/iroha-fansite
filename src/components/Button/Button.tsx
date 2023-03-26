import clsx from 'clsx';
import { type ComponentPropsWithoutRef, memo, type ReactNode } from 'react';

import styles from './Button.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  leftIcon?: ReactNode;
  variant?: 'primary' | 'secondary';
};

export const Button = memo(({ className, variant = 'primary', leftIcon, children, ...props }: Props) => {
  return (
    <button {...props} className={clsx(styles.root, styles[variant], className)}>
      {leftIcon ? <div className={styles.leftIcon}>{leftIcon}</div> : null}
      {children}
    </button>
  );
});
