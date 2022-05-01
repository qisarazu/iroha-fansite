import type { ApiResponse } from '../types/api';

export const fetcher = <T>(url: string): Promise<T> =>
  fetch(url)
    .then((res) => res.json())
    .then((res: ApiResponse<T>) => {
      if ('data' in res && res.data !== undefined) {
        return res.data;
      }
      throw new Error(res.error);
    });
