import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

export function useIsMobile() {
  const { width } = useWindowSize();

  return useMemo(() => width < 768, [width]);
}
