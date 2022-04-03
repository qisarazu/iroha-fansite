import type { ReactNode } from 'react';

import styles from './Table.module.scss';

type Props<T extends unknown> = {
  headers: string[];
  data: T[];
  children: (data: T, index: number) => ReactNode;
};

export const Table = <T extends unknown>({ headers, data, children }: Props<T>) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(children)}</tbody>
    </table>
  );
};
