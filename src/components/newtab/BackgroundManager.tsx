import { useEffect, useState } from "react";
import { useStore, WALLPAPERS } from "@/hooks/useSettings";
import { loadBackgroundImage } from "@/services/imageStore";
import { sanitizeUrl } from "@/services/searchService";

/** Renders the page background layer according to settings. */
export function BackgroundManager() {
  const { settings } = useStore();
  const bg = settings.background;
  const [upload, setUpload] = useState<string | null>(null);

  useEffect(() => {
    if (!bg.hasUpload) {
      setUpload(null);
      return;
    }
    let active = true;
    loadBackgroundImage().then((data) => {
      if (active) setUpload(data ?? null);
    });
    return () => {
      active = false;
    };
  }, [bg.hasUpload, bg.kind]);

  let layer: React.CSSProperties = { background: "var(--color-background)" };

  if (bg.kind === "solid") {
    layer = { background: bg.color };
  } else if (bg.kind === "gradient") {
    layer = { background: bg.gradient };
  } else if (bg.kind === "wallpaper") {
    const wall = WALLPAPERS.find((w) => w.id === bg.wallpaper) ?? WALLPAPERS[0];
    layer = { background: wall?.value };
  } else if (bg.kind === "image") {
    const src = bg.hasUpload && upload ? upload : sanitizeUrl(bg.imageUrl);
    layer = src
      ? { backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: bg.gradient };
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-[-4%] transition-[filter,opacity] duration-300"
        style={{
          ...layer,
          filter: bg.blur ? `blur(${bg.blur}px)` : undefined,
          opacity: bg.opacity / 100,
        }}
      />
      <div className="absolute inset-0 bg-background" style={{ opacity: bg.dim / 100 }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, color-mix(in oklab, var(--accent-color) 12%, transparent) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
