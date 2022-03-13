import clsx from 'clsx';
import { memo, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { useMouseHovered } from 'react-use';
import { useSlider } from './useSlider';

import styles from './Slider.module.scss';

type Props = {
  className?: string;
  value?: number;
  min?: number;
  max?: number;
  label?: (value: number) => string | number;
  labelDisplay?: boolean;
  onScrub?: (value: number) => void;
};

export const Slider = memo(function Slider({
  className,
  value: valueProp,
  min,
  max,
  label,
  labelDisplay = false,
  onScrub,
}: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isLabelDisplay, setLabelDisplay] = useState(false);
  const [thumbRef, setThumbRef] = useState<HTMLDivElement | null>(null);
  const [labelRef, setLabelRef] = useState<HTMLDivElement | null>(null);
  const { isSliding, value, posX } = useSlider(sliderRef, { value: valueProp, min, max, onScrub });
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
          <input className={styles.input} type="range" min={0} max={1} defaultValue={value} />
        </div>
      </div>
      {isLabelDisplay ? (
        <div className={styles.label} style={popperStyles.popper} ref={setLabelRef} {...attributes.popper}>
          {label ? label(value) : value}
        </div>
      ) : null}
    </>
  );
});
