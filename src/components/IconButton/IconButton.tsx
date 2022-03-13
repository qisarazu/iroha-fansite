import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, memo } from 'react';
import styles from './IconButton.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  size?: 'small' | 'medium' | 'large';
};

export const IconButton = memo(
  forwardRef<HTMLButtonElement, Props>(({ className, size = 'medium', disabled, ...props }, ref) => (
    <button
      {...props}
      className={clsx(styles.root, styles[size], className, { [styles['disabled']]: disabled })}
      ref={ref}
    />
  )),
);
