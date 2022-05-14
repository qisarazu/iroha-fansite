import type { ApiResponse } from '../types/api';

type Method = 'get' | 'post' | 'put' | 'delete';

export const fetcher = <T>(url: string, method: Method = 'get', body?: Record<string, unknown>): Promise<T> =>
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: ['post', 'put'].includes(method) && body ? JSON.stringify(body) : undefined,
  })
    .then((res) => res.json())
    .then((res: ApiResponse<T>) => {
      if ('data' in res && res.data !== undefined) {
        return res.data;
      }
      throw new Error(res.error);
    });
