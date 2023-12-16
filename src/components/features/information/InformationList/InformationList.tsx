import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './InformationList.module.css';
import { InformationListItem } from './InformationListItem/InformationListItem';

type ItemProps = ComponentPropsWithoutRef<typeof InformationListItem>;

export type Information = Pick<ItemProps, 'title' | 'src' | 'href' | 'startAt' | 'endAt' | 'showTime'>;

type Props = {
  className?: string;
  items: Information[];
};

export function InformationList({ className, items }: Props) {
  return (
    <div className={clsx(styles.root, className)}>
      {items.map((item) => (
        <InformationListItem className={styles.item} {...item} key={item.href} />
      ))}
    </div>
  );
}
