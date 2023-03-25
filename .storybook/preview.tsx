import { CssBaseline, ThemeProvider } from '@mui/material';
import type { Preview, StoryFn } from '@storybook/react';
import React from 'react';

import { theme } from '../src/styles/theme';

const withMuiTheme = (Story: StoryFn) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withMuiTheme],
};

export default preview;
