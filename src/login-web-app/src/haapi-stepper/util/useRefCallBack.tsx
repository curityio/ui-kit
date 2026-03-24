import { useRef, useCallback, useLayoutEffect } from 'react';

/**
 * A hook to create a stable function reference that always points to the latest
 * version of the provided callback, avoiding stale closures in async code.
 * For example, when passing a callback to a setTimeout or an event listener, you
 * can use this hook to ensure it always has access to the latest state and props.
 *
 * Note: The returned callback must not be invoked during the render phase
 * (e.g. called inline in JSX) because useLayoutEffect runs after the render phase
 * so the callback would be stale. It is safe to pass as a reference to event handlers
 * or invoke inside Effects.
 */
export function useRefCallback<TArgs extends unknown[], TResult>(callback: (...args: TArgs) => TResult) {
  const ref = useRef(callback);

  // useLayoutEffect ensures the ref is updated BEFORE the browser repaints,
  // making it safer for high-frequency events.
  useLayoutEffect(() => {
    ref.current = callback;
  }, [callback]);

  return useCallback((...args: TArgs) => {
    return ref.current(...args);
  }, []);
}
