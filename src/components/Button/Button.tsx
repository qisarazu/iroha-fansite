import clsx from 'clsx';
import { ComponentPropsWithoutRef, memo } from 'react';

import styles from './Button.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
};

export const Button = memo(({ className, variant = 'primary', ...props }: Props) => {
  return <button {...props} className={clsx(styles.root, styles[variant], className)} />;
});
