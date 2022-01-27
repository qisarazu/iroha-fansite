import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { useMouseHovered } from 'react-use';
import { useSlider } from '../../hooks/useSlider';
import styles from './Slider.module.scss';

type Props = {
  className?: string;
  value?: number;
  defaultValue?: number;
  max?: number;
  label?: (value: number) => string | number;
  labelDisplay?: boolean;
  onChange?: (value: number) => void;
};

export function Slider({
  className,
  value: valueProp,
  defaultValue,
  max = 100,
  label,
  labelDisplay = false,
  onChange,
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isLabelDisplay, setLabelDisplay] = useState(false);
  const [thumbRef, setThumbRef] = useState<HTMLDivElement | null>(null);
  const [labelRef, setLabelRef] = useState<HTMLDivElement | null>(null);
  const { isSliding, value, posX } = useSlider(sliderRef, { value: valueProp, defaultValue, max, onChange });
  const {
    styles: popperStyles,
    attributes,
    update,
  } = usePopper(thumbRef, labelRef, { placement: 'top', modifiers: [{ name: 'offset', options: { offset: [0, 4] } }] });
  const { posX: isMouseHovering } = useMouseHovered({ current: thumbRef });

  useEffect(() => {
    setLabelDisplay(labelDisplay && isSliding);
  }, [isSliding, labelDisplay]);

  useEffect(() => {
    update?.();
  }, [update, isMouseHovering]);

  return (
    <>
      <div className={clsx(styles.root, className)} ref={sliderRef}>
        <div className={styles.rail} />
        <div className={clsx(styles.track, styles.sliding)} style={{ width: `${posX}%` }} />
        <div className={clsx(styles.thumb, isSliding && styles.active)} style={{ left: `${posX}%` }} ref={setThumbRef}>
          <input className={styles.input} type="range" min={0} max={1} value={value} onChange={(e) => {}} />
        </div>
      </div>
      {isLabelDisplay && label ? (
        <div className={styles.label} style={popperStyles.popper} ref={setLabelRef} {...attributes.popper}>
          {label(value)}
        </div>
      ) : null}
    </>
  );
}
