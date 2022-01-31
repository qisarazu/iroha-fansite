import { forwardRef, memo } from 'react';
import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './IconButton.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  size?: 'small' | 'medium' | 'large';
};

export const IconButton = memo(
  forwardRef<HTMLButtonElement, Props>(({ className, size = 'medium', ...props }, ref) => (
    <button {...props} className={clsx(styles.root, styles[size], className)} ref={ref} />
  )),
);
