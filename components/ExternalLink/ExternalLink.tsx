import clsx from 'clsx';
import { ComponentPropsWithoutRef, memo } from 'react';
import { MdLaunch } from 'react-icons/md';
import styles from './ExternalLink.module.scss';

type Props = Omit<ComponentPropsWithoutRef<'a'>, 'target' | 'rel' | 'href'> & {
  href: string;
};

export const ExternalLink = memo(function ExternalLink({ className, children, ...props }: Props) {
  return (
    <a {...props} className={clsx(styles.root, className)} target="_blank" rel="noopener noreferrer">
      {children}
      <MdLaunch />
    </a>
  );
});
