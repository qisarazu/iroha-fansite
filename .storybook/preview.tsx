import { MantineProvider } from '@mantine/core';
import type { Preview, StoryFn } from '@storybook/react';
import React from 'react';

import { theme } from '../src/styles/theme';

const withMuiTheme = (Story: StoryFn) => (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Story />
  </MantineProvider>
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
