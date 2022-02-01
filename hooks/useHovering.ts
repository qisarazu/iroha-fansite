import { RefObject, useCallback, useEffect, useState } from 'react';

export const useHovering = (ref: RefObject<HTMLElement>) => {
  const [isHovering, setHovering] = useState(false);

  const onMouseEnter = useCallback(() => {
    setHovering(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    current.addEventListener('mouseenter', onMouseEnter);
    current.addEventListener('mouseleave', onMouseLeave);

    return () => {
      current.removeEventListener('mouseenter', onMouseEnter);
      current.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref, onMouseEnter, onMouseLeave]);

  return isHovering;
};
