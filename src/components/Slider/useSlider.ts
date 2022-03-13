import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMountedState } from 'react-use';

export type State = {
  isSliding: boolean;
  value: number;
  posX: number;
};

export type Props = {
  value?: number;
  min?: number;
  max?: number;
  onScrub?: (value: number) => void;
};

export const useSlider = (
  ref: RefObject<HTMLElement>,
  { value: valueProp, min = 0, max = 100, onScrub }: Props = {},
): State => {
  const isMounted = useMountedState();
  const isSlidingRef = useRef(false);
  const frame = useRef(0);
  const [value, setValue] = useState(valueProp ?? min);
  const [isSliding, setSliding] = useState(false);

  const calc = useCallback(
    (valueX: number) => {
      return clamp(valueX, min, max);
    },
    [max, min],
  );

  useEffect(() => {
    if (!valueProp) return;
    const newValue = calc(valueProp);
    setValue(newValue);
  }, [calc, min, valueProp]);

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
    const onMouseMove = (event: MouseEvent) => _onScrub(event.clientX);

    const onTouchStart = (event: TouchEvent) => {
      startScrubbing();
      onTouchMove(event);
    };
    const onTouchMove = (event: TouchEvent) => _onScrub(event.changedTouches[0].clientX);

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

    const _onScrub = (clientX: number) => {
      cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        if (isMounted() && refCurrent) {
          const rect = ref.current.getBoundingClientRect();
          const posX = rect.left;
          const length = rect.width;

          if (!length) {
            return min;
          }

          const v = ((clientX - posX) / length) * max;
          const value = calc(v);
          setValue(value);
          onScrub?.(value);
        }
      });
    };

    on(refCurrent, 'mousedown', onMouseDown);
    on(refCurrent, 'touchstart', onTouchStart);

    return () => {
      off(refCurrent, 'mousedown', onMouseDown);
      off(refCurrent, 'touchstart', onTouchStart);
    };
  }, [calc, isMounted, max, min, onScrub, ref]);

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
