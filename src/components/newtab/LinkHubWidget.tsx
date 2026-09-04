import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { LINK_CATEGORIES } from "@/data/linkHub";

const STORAGE_KEY = "bittab:linkhub:collapsed";

export default function LinkHubWidget() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") setCollapsed(parsed as Record<string, boolean>);
      }
    } catch {
      /* ignora dados inválidos */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
      /* armazenamento indisponível */
    }
  }, [collapsed, loaded]);


  return (
    <section aria-label="Plataformas por categoria" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LINK_CATEGORIES.map((cat) => {
        const isClosed = collapsed[cat.id] === true;
        return (
          <article key={cat.id} className="glass rise-in rounded-2xl p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 text-left"
              aria-expanded={!isClosed}
              onClick={() => setCollapsed((prev) => ({ ...prev, [cat.id]: !isClosed }))}
            >
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span aria-hidden>{cat.icon}</span>
                {cat.title}
              </h3>
              <ChevronDown
                className={`size-4 shrink-0 text-muted-foreground transition-transform ${isClosed ? "-rotate-90" : ""}`}
                aria-hidden
              />
            </button>

            {!isClosed && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {cat.links.map((l) => (
                  <li key={l.name}>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg bg-secondary/50 px-2 py-1 text-xs transition-colors hover:bg-secondary hover:text-accent-color focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        );
      })}
    </section>
  );
}
