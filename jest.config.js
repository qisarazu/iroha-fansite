const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/src/**/*.test.ts?(x)'],
};

module.exports = createJestConfig(customJestConfig);
