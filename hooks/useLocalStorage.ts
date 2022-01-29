import { Dispatch, SetStateAction, useCallback, useState, useRef, useLayoutEffect } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>, () => void] => {
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

  useLayoutEffect(() => setState(initializer.current(key)), [key]);

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

export default useLocalStorage;
