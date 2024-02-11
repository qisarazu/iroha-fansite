import type { MantineThemeOverride } from '@mantine/core';
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#46bfb9',
      light: '#b2e3e1',
      dark: '#008478',
    },
  },
});

export const theme: MantineThemeOverride = {
  fontFamily: "'M PLUS Rounded 1c', 'Nunito', sans-serif",
  primaryColor: 'teal',
};
