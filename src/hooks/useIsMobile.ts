import { useEffect, useMemo, useState } from 'react';

export function useIsMobile() {
  const [width, setWidth] = useState<number>(Infinity);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWidth(window.innerWidth);

      const listener = () => {
        setWidth(window.innerWidth);
      };
      window.addEventListener('resize', listener);

      return () => {
        window.removeEventListener('resize', listener);
      };
    }
  }, []);

  return useMemo(() => width <= 768, [width]);
}
