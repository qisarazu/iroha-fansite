import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './ActivityList.module.css';
import { ActivityListItem } from './ActivityListItem/ActivityListItem';

type ItemProps = ComponentPropsWithoutRef<typeof ActivityListItem>;

type Props = {
  className?: string;
  items: ItemProps[];
};

export function ActivityList({ className, items }: Props) {
  return (
    <div className={clsx(styles.root, className)}>
      {items.map((item) => (
        <ActivityListItem className={styles.item} {...item} key={item.id} />
      ))}
    </div>
  );
}
