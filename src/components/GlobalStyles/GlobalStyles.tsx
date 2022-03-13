import { Global } from '@mantine/core';

export const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        '*': {
          margin: 0,
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        'html, body': {
          height: '100%',
        },
        body: {
          lineHeight: 1.5,
          color: theme.white,
          backgroundColor: theme.black,
          overflowY: 'scroll',
          WebkitFontSmoothing: 'antialiased',
        },
        '#root,#__next': {
          isolation: 'isolate',
        },
        a: {
          color: theme.white,
          textDecoration: 'none',
        },
        'a, button': {
          cursor: 'pointer',
        },
        ul: {
          marginBlockStart: 0,
          marginBlockEnd: 0,
          marginInlineStart: 0,
          marginInlineEnd: 0,
          paddingInlineStart: 0,
        },
        li: {
          listStyle: 'none',
        },
        'img, picture, video, canvas, svg': {
          maxWidth: '100%',
        },
        'input, button, textarea, select': {
          font: 'inherit',
        },
        'p, h1, h2, h3, h4, h5, h6': {
          overflowWrap: 'break-word',
        },
      })}
    />
  );
};
