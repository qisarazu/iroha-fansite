import clsx from 'clsx';
import { differenceInDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useCallback, useMemo } from 'react';

import styles from './InformationListItem.module.css';

type Props = {
  className?: string;
  src: string;
  href: string;
  title: string;
  startAt: Date;
  endAt: Date | string;
  showTime?: boolean;
};

export function InformationListItem({ className, src, href, title, startAt, endAt, showTime }: Props) {
  const isNearly = useMemo(() => {
    if (typeof endAt === 'string') return false;

    const diffDays = differenceInDays(endAt, new Date());
    return 0 <= diffDays && diffDays < 7;
  }, [endAt]);

  const dateFormat = useCallback(
    (date: Date | string) => {
      if (typeof date === 'string') return date;

      if (showTime) {
        return format(date, 'yyyy/MM/dd (EEEEE) HH:mm', { locale: ja });
      }
      return format(date, 'yyyy/MM/dd (EEEEE)', { locale: ja });
    },
    [showTime],
  );

  return (
    <div className={clsx(styles.root, className)}>
      <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
        <div className={styles.thumbnail}>
          <img className={styles.thumbnailImage} src={src} alt={title} />
        </div>
      </a>
      <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
        <h2 className={styles.title}>{title}</h2>
      </a>
      <div className={styles.term}>
        <p className={styles.termStart}>{dateFormat(startAt)}</p>
        <p className={styles.termEnd}>
          ～ <span className={clsx({ [styles.isNearly]: isNearly })}>{dateFormat(endAt)}</span>
        </p>
      </div>
    </div>
  );
}
