import { ChangeEvent, memo } from 'react';

export type Option = { label: string; value: string };

type Props = {
  rowIndex: number;
  columnId: string;
  value: Option['value'];
  options: Option[];
  onChange: (rowIndex: number, columnId: string, value: Option['value']) => void;
};

export const SelectableCell = memo(({ rowIndex, columnId, value, options, onChange }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(rowIndex, columnId, e.currentTarget.value);
  };

  return (
    <td>
      <select value={value} onChange={handleChange}>
        {[{ label: '', value: '' }].concat(options).map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </td>
  );
});
