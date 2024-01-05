import type { Activity } from '@prisma/client';
import clsx from 'clsx';
import { differenceInDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useCallback, useMemo } from 'react';

import styles from './ActivityListItem.module.css';

type Props = {
  className?: string;
} & Activity;

export function ActivityListItem({
  className,
  thumbnailURL,
  detailURL,
  title,
  startAt,
  endAt,
  endNote,
  isShowTime,
}: Props) {
  const isNearly = useMemo(() => {
    if (!endAt) return false;

    const diffDays = differenceInDays(new Date(endAt), new Date());
    return 0 <= diffDays && diffDays < 3;
  }, [endAt]);

  const dateFormat = useCallback(
    (date: Date | null) => {
      if (!date) {
        return endNote ?? '';
      }

      if (isShowTime) {
        return format(new Date(date), 'yyyy/MM/dd (EEEEE) HH:mm', { locale: ja });
      }
      return format(new Date(date), 'yyyy/MM/dd (EEEEE)', { locale: ja });
    },
    [endNote, isShowTime],
  );

  return (
    <div className={clsx(styles.root, className)}>
      <a className={styles.link} href={detailURL} target="_blank" rel="noopener noreferrer">
        <div className={styles.thumbnail}>
          <img className={styles.thumbnailImage} src={thumbnailURL} alt={title} />
        </div>
      </a>
      <a className={styles.link} href={detailURL} target="_blank" rel="noopener noreferrer">
        <h2 className={styles.title}>{title}</h2>
      </a>
      <div className={styles.term}>
        <p className={styles.termStart}>
          {dateFormat(startAt)}
          {endAt || endNote ? null : ' ～'}
        </p>
        {endAt || endNote ? (
          <p className={styles.termEnd}>
            ～ <span className={clsx({ [styles.isNearly]: isNearly })}>{dateFormat(endAt)}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
