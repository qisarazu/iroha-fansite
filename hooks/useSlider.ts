import { RefObject, useEffect, useRef, useState } from 'react';
import { useMountedState } from 'react-use';

export interface State {
  isSliding: boolean;
  value: number;
}

export interface Options {
  defaultValue?: number;
  maxValue?: number;
  onChange?: (value: number) => void;
}

const useSlider = (
  ref: RefObject<HTMLElement>,
  { defaultValue = 0, maxValue = 100, onChange }: Options = {}
): State => {
  const isMounted = useMountedState();
  const isSlidingRef = useRef(false);
  const frame = useRef(0);
  const [isSliding, setSliding] = useState(false);
  const [value, setValue] = useState(defaultValue);

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
    const onTouchMove = (event: TouchEvent) =>
      onScrub(event.changedTouches[0].clientX);

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

    const onScrub = (clientXY: number) => {
      cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        if (isMounted() && refCurrent) {
          const rect = refCurrent.getBoundingClientRect();
          const pos = rect.left;
          const length = rect.width;

          // Prevent returning 0 when element is hidden by CSS
          if (!length) {
            return;
          }

          let value = ((clientXY - pos) * maxValue) / length;

          if (value > maxValue) {
            value = maxValue;
          } else if (value < 0) {
            value = 0;
          }

          setValue(value);
          onChange?.(value);
        }
      });
    };

    on(refCurrent, 'mousedown', onMouseDown);
    on(refCurrent, 'touchstart', onTouchStart);

    return () => {
      off(refCurrent, 'mousedown', onMouseDown);
      off(refCurrent, 'touchstart', onTouchStart);
    };
  }, [isMounted, maxValue, onChange, ref]);

  return { isSliding, value };
};

export default useSlider;

function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(
      ...(args as Parameters<HTMLElement['addEventListener']>)
    );
  }
}

function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args:
    | Parameters<T['removeEventListener']>
    | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(
      ...(args as Parameters<HTMLElement['removeEventListener']>)
    );
  }
}
