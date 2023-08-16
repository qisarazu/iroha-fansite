import { describe, expect, test } from 'vitest';

import { formatVideoLength } from './formatVideoLength';

describe('formatVideoLength', () => {
  test.each([
    [-1, '00:00'],
    [0, '00:00'],
    [1, '00:01'],
    [59, '00:59'],
    [60, '01:00'],
    [61, '01:01'],
    [3599, '59:59'],
    [3600, '60:00'],
    [3601, '60:01'],
  ])('should format %d to %s', (length, expected) => {
    expect(formatVideoLength(length)).toBe(expected);
  });
});
