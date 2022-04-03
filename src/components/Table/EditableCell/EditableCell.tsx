import { ComponentPropsWithoutRef, memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Value = string | number;

type Props = Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange'> & {
  value: Value;
  rowIndex: number;
  columnId: string;
  onChange: (rowIndex: number, columnId: string, value: Value) => void;
};

export const EditableCell = memo(({ value, rowIndex, columnId, onChange, ...props }: Props) => {
  const { register, getValues, setFocus } = useForm<{ value: Value }>({
    defaultValues: {
      value,
    },
  });

  const [mode, setMode] = useState<'edit' | 'view'>('view');

  const changeToView = () => {
    setMode('view');
  };

  const changeToEdit = () => {
    setMode('edit');
  };

  const onBlur = () => {
    onChange(rowIndex, columnId, getValues('value'));
    changeToView();
  };

  useEffect(() => {
    if (mode === 'edit') {
      setFocus('value');
    }
  }, [mode, setFocus]);

  return (
    <td>
      {mode === 'view' ? (
        <div style={{ width: '100%', height: '100%' }} onClick={changeToEdit}>
          {getValues('value')}
        </div>
      ) : (
        <input {...props} {...register('value', { onBlur })} />
      )}
    </td>
  );
});
