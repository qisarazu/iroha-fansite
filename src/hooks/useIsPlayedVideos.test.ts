import { act, renderHook } from '@testing-library/react-hooks';
import { addMilliseconds } from 'date-fns';
import MockDate from 'mockdate';

import { useIsPlayedVideos, VALID_TIME } from './useIsPlayedVideos';

describe('useIsPlayedVideos', () => {
  test('有効日数以内であれば true が返る', () => {
    MockDate.set('2020-01-01T00:00:00.000Z');
    const { result } = renderHook(() => useIsPlayedVideos());
    act(() => {
      result.current.addPlayedVideo('videoId');
    });

    // 同日
    expect(result.current.isPlayedVideo('videoId')).toBe(true);

    // 有効時間内
    MockDate.set(addMilliseconds(new Date('2020-01-01T00:00:00.000Z'), VALID_TIME));
    expect(result.current.isPlayedVideo('videoId')).toBe(true);

    // 有効時間を過ぎている
    MockDate.set(addMilliseconds(new Date('2020-01-01T00:00:00.000Z'), VALID_TIME + 1));
    expect(result.current.isPlayedVideo('videoId')).toBe(false);
  });
});
