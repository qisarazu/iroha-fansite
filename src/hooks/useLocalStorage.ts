import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

// based on https://github.com/streamich/react-use/blob/3685b7502a/src/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>, () => void] => {
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy');
  }

  const initializer = useRef((key: string) => {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue !== null) {
      return JSON.parse(localStorageValue);
    } else {
      initialValue && localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    }
  });

  const [state, setState] = useState<T>(() =>
    typeof window === 'undefined' ? initialValue : initializer.current(key),
  );

  useEffect(() => setState(initializer.current(key)), [key]);

  const set: Dispatch<SetStateAction<T>> = useCallback(
    (state) => {
      const value = JSON.stringify(state);
      localStorage.setItem(key, value);
      setState(JSON.parse(value));
    },
    [key],
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return [state, set, remove];
};
