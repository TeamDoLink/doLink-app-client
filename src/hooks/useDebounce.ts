import { useCallback, useEffect, useRef } from 'react';

/**
 * 연속 호출 시 마지막 호출만 `delay` ms 후 실행하는 함수를 반환합니다.
 */
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay],
  );
};
