import type { SearchEngineId } from "@/types";

export const SEARCH_ENGINES: Record<SearchEngineId, { name: string; url: string }> = {
  google: { name: "Google", url: "https://www.google.com/search?q=" },
  bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
  duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  brave: { name: "Brave Search", url: "https://search.brave.com/search?q=" },
  ecosia: { name: "Ecosia", url: "https://www.ecosia.org/search?q=" },
};

const SAFE_PROTOCOLS = ["http:", "https:"];

/** Returns a safe absolute http(s) URL, or null when the input isn't a URL. */
export function parseUrl(input: string): string | null {
  const value = input.trim();
  if (!value || /\s/.test(value)) return null;

  const candidates = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? [value] : [`https://${value}`];
  for (const candidate of candidates) {
    try {
      const url = new URL(candidate);
      if (!SAFE_PROTOCOLS.includes(url.protocol)) return null;
      const isDomain = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname);
      if (!isDomain && url.hostname !== "localhost") return null;
      return url.toString();
    } catch {
      return null;
    }
  }
  return null;
}

/** Sanitizes a user-provided URL for links/icons; returns "" when unsafe. */
export function sanitizeUrl(input: string): string {
  return parseUrl(input) ?? "";
}

export function buildSearchTarget(query: string, engine: SearchEngineId): string | null {
  const value = query.trim();
  if (!value) return null;
  const asUrl = parseUrl(value);
  if (asUrl) return asUrl;
  return SEARCH_ENGINES[engine].url + encodeURIComponent(value);
}

export function faviconFor(url: string): string {
  const safe = parseUrl(url);
  if (!safe) return "";
  try {
    return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(safe).hostname}`;
  } catch {
    return "";
  }
}
