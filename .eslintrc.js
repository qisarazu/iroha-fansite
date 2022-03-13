module.exports = {
  extends: 'next/core-web-vitals',
  plugins: ['simple-import-sort'],
  rules: {
    'react/display-name': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
