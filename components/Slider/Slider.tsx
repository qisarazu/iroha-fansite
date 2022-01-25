import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { useHoverDirty, useMouseHovered } from 'react-use';
import useSlider from '../../hooks/useSlider';
import styles from './Slider.module.scss';

type Props = {
  className?: string;
  defaultValue?: number;
  maxValue?: number;
  label?: string | number;
  labelDisplay?: boolean;
  onChange: (value: number) => void;
};

export function Slider({
  className,
  defaultValue = 0,
  maxValue = 100,
  label,
  labelDisplay = false,
  onChange
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isLabelDisplay, setLabelDisplay] = useState(false);
  const [thumbRef, setThumbRef] = useState<HTMLDivElement | null>(null);
  const [labelRef, setLabelRef] = useState<HTMLDivElement | null>(null);
  const { isSliding, value } = useSlider(sliderRef, {
    defaultValue,
    maxValue,
    onChange
  });
  const {
    styles: popperStyles,
    attributes,
    update
  } = usePopper(thumbRef, labelRef, {
    placement: 'top',
    modifiers: [{ name: 'offset', options: { offset: [0, 4] } }]
  });
  const { posX } = useMouseHovered({ current: thumbRef });

  useEffect(() => {
    setLabelDisplay(labelDisplay && isSliding);
  }, [isSliding, labelDisplay]);

  useEffect(() => {
    update?.();
  }, [update, posX]);

  return (
    <>
      <div className={clsx(styles.root, className)} ref={sliderRef}>
        <div className={styles.rail} />
        <div
          className={clsx(styles.track, styles.sliding)}
          style={{ width: `${value}%` }}
        />
        <div
          className={clsx(styles.thumb, isSliding && styles.active)}
          style={{ left: `${value}%` }}
          ref={setThumbRef}
        >
          <input
            className={styles.input}
            type="range"
            min={0}
            max={1}
            defaultValue={value}
          />
        </div>
      </div>
      {isLabelDisplay ? (
        <div
          className={styles.label}
          style={popperStyles.popper}
          ref={setLabelRef}
          {...attributes.popper}
        >
          {label}
        </div>
      ) : null}
    </>
  );
}
