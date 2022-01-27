import { RefObject, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useMountedState } from 'react-use';

export type State = {
  isSliding: boolean;
  value: number;
  posX: number;
};

export type Props = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};

export const useSlider = (
  ref: RefObject<HTMLElement>,
  { value: valueProp, defaultValue, min = 0, max = 100, onChange }: Props = {},
): State => {
  const isMounted = useMountedState();
  const isSlidingRef = useRef(false);
  const frame = useRef(0);
  const [isSliding, setSliding] = useState(false);
  const [value, setValue] = useState(defaultValue ?? min);

  const calc = useCallback(
    (xValue: number, clicked: boolean = false) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const posX = rect.left;
      const length = rect.width;

      if (!length) {
        return;
      }

      const value = clamp(clicked ? ((xValue - posX) / length) * max : xValue, min, max);

      setValue(value);
      onChange?.(value);
    },
    [max, min, onChange, ref],
  );

  useEffect(() => {
    if (valueProp !== undefined) {
      calc(valueProp);
    }
  }, [calc, valueProp]);

  useEffect(() => {
    const refCurrent = ref.current;
    if (refCurrent) {
      refCurrent.style.userSelect = 'none';
    }

    const startScrubbing = () => {
      if (!isSlidingRef.current && isMounted()) {
        isSlidingRef.current = true;
        setSliding(true);
        bindEvents();
      }
    };

    const stopScrubbing = () => {
      if (isSlidingRef.current && isMounted()) {
        isSlidingRef.current = false;
        setSliding(false);
        unbindEvents();
      }
    };

    const onMouseDown = (event: MouseEvent) => {
      startScrubbing();
      onMouseMove(event);
    };
    const onMouseMove = (event: MouseEvent) => onScrub(event.clientX);

    const onTouchStart = (event: TouchEvent) => {
      startScrubbing();
      onTouchMove(event);
    };
    const onTouchMove = (event: TouchEvent) => onScrub(event.changedTouches[0].clientX);

    const bindEvents = () => {
      on(document, 'mousemove', onMouseMove);
      on(document, 'mouseup', stopScrubbing);

      on(document, 'touchmove', onTouchMove);
      on(document, 'touchend', stopScrubbing);
    };

    const unbindEvents = () => {
      off(document, 'mousemove', onMouseMove);
      off(document, 'mouseup', stopScrubbing);

      off(document, 'touchmove', onTouchMove);
      off(document, 'touchend', stopScrubbing);
    };

    const onScrub = (clientX: number) => {
      cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        if (isMounted() && refCurrent) {
          calc(clientX, true);
        }
      });
    };

    on(refCurrent, 'mousedown', onMouseDown);
    on(refCurrent, 'touchstart', onTouchStart);

    return () => {
      off(refCurrent, 'mousedown', onMouseDown);
      off(refCurrent, 'touchstart', onTouchStart);
    };
  }, [calc, isMounted, ref]);

  const posX = useMemo(() => {
    const offset = valueToPercent(min, min, max);
    const percent = valueToPercent(value, min, max) - offset;
    return percent;
  }, [max, min, value]);

  return { isSliding, value, posX };
};

function clamp(value: number, min: number, max: number) {
  if (value == null) {
    return min;
  }
  return Math.min(Math.max(min, value), max);
}

function valueToPercent(value: number, min: number, max: number) {
  return ((value - min) * 100) / (max - min);
}

function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}
