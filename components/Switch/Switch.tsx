import clsx from 'clsx';
import { useEffect, memo, useState, useCallback, useMemo, ChangeEvent, ComponentPropsWithoutRef } from 'react';
import styles from './Switch.module.scss';

type Props = {
  className?: string;
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  inputProps?: ComponentPropsWithoutRef<'input'>;
  onChange?: (checked: boolean) => void;
};

export const Switch = memo(
  ({ className, label, checked: checkedProps = false, defaultChecked = false, inputProps, onChange }: Props) => {
    const [checked, setChecked] = useState(defaultChecked);

    useEffect(() => {
      setChecked(checkedProps);
    }, [checkedProps]);

    const onClick = useCallback(() => {
      setChecked((state) => !state);
    }, []);

    const onInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.currentTarget.checked);
      },
      [onChange],
    );

    const element = useMemo(
      () => (
        <>
          <span className={clsx(styles.root, className)}>
            <span className={clsx(styles.track, { [styles['checkedTrack']]: checked })} />
            <span className={clsx(styles.base, { [styles['checkedBase']]: checked })}>
              <input
                {...inputProps}
                className={styles.input}
                type="checkbox"
                checked={checked}
                onClick={onClick}
                onChange={onInputChange}
              />
              <span className={clsx(styles.thumb)} />
            </span>
          </span>
        </>
      ),
      [checked, className, inputProps, onClick, onInputChange],
    );

    return label ? (
      <label>
        <span>{label}</span>
        {element}
      </label>
    ) : (
      element
    );
  },
);
