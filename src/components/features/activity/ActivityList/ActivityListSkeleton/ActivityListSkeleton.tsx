import clsx from 'clsx';

import styles from './ActivityListSkeleton.module.css';

type Props = {
  className?: string;
  count?: number;
};

export function ActivityListSkeleton({ className, count = 3 }: Props) {
  return (
    <div className={clsx(styles.root, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div className={styles.item} key={i}>
          <div className={styles.thumbnail} />
          <div className={styles.title} />
          <div className={styles.term} />
        </div>
      ))}
    </div>
  );
}
