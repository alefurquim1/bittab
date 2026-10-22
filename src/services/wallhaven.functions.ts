import { createServerFn } from "@tanstack/react-start";

/** Fetches a random SFW wallpaper from Wallhaven, optionally filtered by a search term. */
export const fetchWallpaper = createServerFn({ method: "GET" })
  .inputValidator((data: { q?: string }) => ({ q: String(data?.q ?? "").slice(0, 100) }))
  .handler(async ({ data }) => {
    const params = new URLSearchParams({
      sorting: "random",
      purity: "100",
      categories: "110",
      atleast: "1920x1080",
    });
    if (data.q.trim()) params.set("q", data.q.trim());
    const res = await fetch(`https://wallhaven.cc/api/v1/search?${params}`, {
      headers: { "User-Agent": "BitTab/1.0" },
    });
    if (!res.ok) return { url: null as string | null };
    const json = (await res.json()) as { data?: Array<{ path: string }> };
    const list = json.data ?? [];
    const pick = list[Math.floor(Math.random() * list.length)];
    return { url: pick?.path ?? null };
  });
