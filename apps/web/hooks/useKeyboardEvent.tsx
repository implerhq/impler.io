import { useEffect, useRef } from 'react';

export function useKeyboardEvent(key: string, callback: () => void) {
  const listenerRef = useRef<any>(null);

  useEffect(() => {
    if (listenerRef.current) return; // Skip if listener is already set

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === key) callback();
    };

    document.body.addEventListener('keydown', handleKeyDown, {
      capture: false,
    });

    // Store the listener reference
    listenerRef.current = handleKeyDown;

    // Cleanup function
    return () => {
      if (listenerRef.current) {
        document.body.removeEventListener('keydown', listenerRef.current, {
          capture: false,
        });
        listenerRef.current = null;
      }
    };
  }, [callback, key]);
}
