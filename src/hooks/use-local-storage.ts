import { useCallback, useEffect, useState } from "react";

function getItem<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValueState] = useState<T>(() =>
    getItem(key, initialValue)
  );

  // Rehydrate when the key changes (e.g. across route mounts).
  useEffect(() => {
    setValueState(getItem(key, initialValue));
  }, [key, initialValue]);

  // Sync across browser tabs.
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        setValueState(
          event.newValue ? (JSON.parse(event.newValue) as T) : initialValue
        );
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, initialValue]);

  // Persist to localStorage whenever the value changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
  }, [key, value]);

  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const resolved =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        return resolved;
      });
    },
    []
  );

  return [value, setValue] as const;
}
