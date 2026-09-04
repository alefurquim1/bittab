import { useCallback, useEffect, useRef, useState } from "react";

/**
 * SSR-safe localStorage state. Starts from `initialValue` on the server and on
 * first client render, then hydrates from storage in an effect (avoids
 * hydration mismatches). Writes are persisted automatically.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const initial = useRef(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(merge(initial.current, JSON.parse(raw) as T));
    } catch {
      /* corrupted or unavailable storage: keep defaults */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded: ignore */
    }
  }, [key, value, hydrated]);

  const reset = useCallback(() => setValue(initial.current), []);

  return { value, setValue, hydrated, reset };
}

/** Shallow-deep merge so new default keys survive older stored payloads. */
function merge<T>(base: T, stored: T): T {
  if (
    base &&
    stored &&
    typeof base === "object" &&
    typeof stored === "object" &&
    !Array.isArray(base) &&
    !Array.isArray(stored)
  ) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(stored as Record<string, unknown>)) {
      const b = (base as Record<string, unknown>)[k];
      out[k] = b !== undefined ? merge(b, v) : v;
    }
    return out as T;
  }
  return stored;
}
