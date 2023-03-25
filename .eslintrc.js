module.exports = {
  extends: ['next/core-web-vitals', 'plugin:storybook/recommended'],
  plugins: ['simple-import-sort'],
  rules: {
    'react/display-name': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  ignorePatterns: ['!.storybook'],
};
