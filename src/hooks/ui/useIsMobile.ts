import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function useIsMobile() {
  const theme = useMantineTheme();
  const matches = useMediaQuery(theme.fn.smallerThan('sm').split('@media ')[1]);

  return matches;
}
