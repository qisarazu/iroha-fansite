'use client';

import type { Activity } from '@prisma/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useCallback } from 'react';

import { deleteActivityAction } from '../../../../../services/activities/action';
import styles from './List.module.css';

type Props = {
  activities: Activity[];
};

export function List({ activities }: Props) {
  const formatDate = useCallback((date: Date, isShowTime: boolean) => {
    if (isShowTime) {
      return format(new Date(date), 'yyyy/MM/dd (EEEEE) HH:mm', { locale: ja });
    }
    return format(new Date(date), 'yyyy/MM/dd (EEEEE)', { locale: ja });
  }, []);

  return (
    <table className={styles.root}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>thumbnail</th>
          <th className={styles.th}>status</th>
          <th className={styles.th}>type</th>
          <th className={styles.th}>title</th>
          <th className={styles.th}>detailURL</th>
          <th className={styles.th}>isShowTime</th>
          <th className={styles.th}>startAt</th>
          <th className={styles.th}>endAt</th>
          <th className={styles.th}>endNote</th>
          <th className={styles.th}>action</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr className={styles.tr} key={activity.id}>
            <td className={styles.td}>
              <img src={activity.thumbnailURL} width={160} alt={activity.title} />
            </td>

            <td className={styles.td}>{activity.status}</td>

            <td className={styles.td}>{activity.type}</td>

            <td className={styles.td}>{activity.title}</td>

            <td className={styles.td}>{activity.detailURL}</td>

            <td className={styles.td}>
              <input type="checkbox" defaultChecked={activity.isShowTime} disabled />
            </td>

            <td className={styles.td}>
              <p>{formatDate(activity.startAt, activity.isShowTime)}</p>
            </td>

            <td className={styles.td}>
              {activity.endAt ? <p>{formatDate(activity.endAt, activity.isShowTime)}</p> : null}
            </td>

            <td className={styles.td}>{activity.endNote ? <p>{activity.endNote}</p> : null}</td>

            <td className={styles.td}>
              <button
                onClick={async () => {
                  if (confirm(`${activity.title} を削除しますか？`)) {
                    await deleteActivityAction({ id: activity.id });
                  }
                }}
              >
                delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
