import { useEffect, useState, useSyncExternalStore } from "react";

function getItem<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") return initialValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

function subscribe(callback: () => void) {
  const handler = (event: StorageEvent) => {
    if (event.storageArea === window.localStorage) {
      callback();
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = () => getItem<T>(key, initialValue);

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialValue
  );

  const [value, setValue] = useState<T>(storedValue);

  useEffect(() => {
    setValue(getItem(key, initialValue));
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    } catch {
      // Ignore storage errors (e.g. private mode).
    }
  }, [key, value]);

  return [value, setValue] as const;
}
