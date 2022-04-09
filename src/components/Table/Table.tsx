import { ReactNode, useCallback, useState } from 'react';

import styles from './Table.module.scss';

type Props<T extends unknown> = {
  headers: string[];
  data: T[];
  defaultSort: {
    key: string;
    direction: 'asc' | 'desc';
  };
  children: (data: T, index: number) => ReactNode;
  onSortChange: (key: string, direction: 'asc' | 'desc') => void;
};

export const Table = <T extends unknown>({ headers, data, defaultSort, onSortChange, children }: Props<T>) => {
  const [currentSort, setCurrentSort] = useState(defaultSort.key);
  const [currentSortDirection, setCurrentSortDirection] = useState(defaultSort.direction);

  const onHeaderClick = useCallback(
    (key: string) => () => {
      const nextDirection = currentSort === key ? (currentSortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
      setCurrentSort(key);
      setCurrentSortDirection(nextDirection);

      onSortChange(key, nextDirection);
    },
    [currentSort, currentSortDirection, onSortChange],
  );

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((column) => (
            <th key={column.toString()} onClick={onHeaderClick(column)}>
              {column}
              {currentSort === column ? ` ${currentSortDirection === 'asc' ? '▲' : '▼'}` : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(children)}</tbody>
    </table>
  );
};
