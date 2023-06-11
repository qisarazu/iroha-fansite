type Method = 'get' | 'post' | 'put' | 'delete';

export const apiClient = <T>(url: string, method: Method = 'get', body?: Record<string, unknown>): Promise<T> =>
  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: ['post', 'put'].includes(method) && body ? JSON.stringify(body) : undefined,
  })
    .then((res) => res.json())
    .then((res: T) => {
      if (!res || typeof res !== 'object') {
        throw new Error('invalid response');
      }

      if ('data' in res && res.data !== undefined) {
        return res;
      }

      if ('error' in res) {
        throw res.error;
      }
      throw new Error('Unknown fetcher error');
    });
