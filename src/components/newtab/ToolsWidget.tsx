import { ArrowUpRight } from "lucide-react";
import { useStore } from "@/hooks/useSettings";
import { sanitizeUrl } from "@/services/searchService";

export default function ToolsWidget() {
  const { tools } = useStore();

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Ferramentas</h3>
      <ul className="mt-3 grid gap-1">
        {tools.map((t) => {
          const href = sanitizeUrl(t.url);
          return (
            <li key={t.id}>
              <a
                href={href || undefined}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="truncate">{t.name}</span>
                <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
