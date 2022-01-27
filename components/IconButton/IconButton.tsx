import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './IconButton.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  size?: 'small' | 'medium' | 'large';
};

export function IconButton({ className, size = 'medium', ...props }: Props) {
  return <button className={clsx(styles.root, styles[size], className)} {...props} />;
}
