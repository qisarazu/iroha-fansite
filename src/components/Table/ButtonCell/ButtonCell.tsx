import { ComponentPropsWithoutRef, memo, useCallback } from 'react';

import { Button } from '../../Button/Button';

type Props = Omit<ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
  label: string;
  rowIndex: number;
  columnId: string;
  onClick: (rowIndex: number, columnId: string) => void;
};

export const ButtonCell = memo(({ label, rowIndex, columnId, onClick, ...props }: Props) => {
  const handleClick = useCallback(() => {
    onClick(rowIndex, columnId);
  }, [columnId, onClick, rowIndex]);

  return (
    <td>
      <Button {...props} onClick={handleClick}>
        {label}
      </Button>
    </td>
  );
});
