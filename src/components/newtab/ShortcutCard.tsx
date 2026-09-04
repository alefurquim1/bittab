import { useState } from "react";
import { Globe, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "@/hooks/useSettings";
import { faviconFor, sanitizeUrl } from "@/services/searchService";
import type { Shortcut } from "@/types";

interface Props {
  shortcut: Shortcut;
  onEdit: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDrop: () => void;
  dragging: boolean;
}

export function ShortcutCard({ shortcut, onEdit, onRemove, onDragStart, onDragEnter, onDrop, dragging }: Props) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const href = sanitizeUrl(shortcut.url);
  const icon = sanitizeUrl(shortcut.icon ?? "") || faviconFor(shortcut.url);

  return (
    <div
      className={`group relative ${dragging ? "opacity-40" : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <a
        href={href || undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="glass glass-hover flex flex-col items-center gap-2 rounded-2xl px-2 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-secondary/80">
          {icon && !failed ? (
            <img
              src={icon}
              alt=""
              width={20}
              height={20}
              loading="lazy"
              className="size-5"
              onError={() => setFailed(true)}
            />
          ) : (
            <Globe className="size-4 text-muted-foreground" aria-hidden />
          )}
        </span>
        <span className="line-clamp-1 max-w-full text-center text-[0.72rem] font-medium">{shortcut.name}</span>
      </a>

      <div className="absolute -top-1.5 right-0 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          aria-label={t("shortcuts.editOf", { name: shortcut.name })}
          className="grid size-6 place-items-center rounded-full border border-glass-border bg-popover text-muted-foreground hover:text-foreground"
        >
          <Pencil className="size-3" aria-hidden />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t("shortcuts.removeOf", { name: shortcut.name })}
          className="grid size-6 place-items-center rounded-full border border-glass-border bg-popover text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3" aria-hidden />
        </button>
      </div>
    </div>
  );
}
