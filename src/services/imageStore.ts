/**
 * IndexedDB storage for the custom background image (too large for localStorage).
 */
const DB_NAME = "bit01tec-newtab";
const STORE = "assets";
const KEY = "background";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest): Promise<T | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const db = await open();
    return await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

export function saveBackgroundImage(dataUrl: string) {
  return withStore<void>("readwrite", (s) => s.put(dataUrl, KEY));
}

export function loadBackgroundImage() {
  return withStore<string>("readonly", (s) => s.get(KEY));
}

export function clearBackgroundImage() {
  return withStore<void>("readwrite", (s) => s.delete(KEY));
}
