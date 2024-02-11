import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function useIsMobile() {
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return matches;
}
