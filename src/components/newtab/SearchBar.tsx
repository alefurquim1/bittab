import { forwardRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/hooks/useSettings";
import { buildSearchTarget, SEARCH_ENGINES } from "@/services/searchService";
import type { SearchEngineId } from "@/types";

export const SearchBar = forwardRef<HTMLInputElement>(function SearchBar(_props, ref) {
  const { settings, update } = useStore();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("q");
    const target = buildSearchTarget(String(input ?? ""), settings.searchEngine);
    if (!target) return;

    // Dentro de um iframe (pré-visualização/extensão) os buscadores bloqueiam
    // a exibição incorporada — abrimos fora do quadro.
    const inFrame = typeof window !== "undefined" && window.self !== window.top;
    if (inFrame) {
      const opened = window.open(target, "_blank", "noopener,noreferrer");
      if (!opened && window.top) {
        try {
          window.top.location.assign(target);
        } catch {
          window.location.assign(target);
        }
      }
      return;
    }
    window.location.assign(target);
  }


  return (
    <form onSubmit={onSubmit} role="search" className="rise-in w-full">
      <div className="glass flex items-center gap-2 rounded-2xl px-3 py-2 focus-within:accent-glow sm:px-4 sm:py-2.5">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <label className="sr-only" htmlFor="newtab-search">
          Pesquisar na web ou digitar um endereço
        </label>
        <input
          id="newtab-search"
          ref={ref}
          name="q"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Pesquisar na web ou digitar um endereço..."
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
        />
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            aria-label="Escolher mecanismo de pesquisa"
            className="flex shrink-0 items-center gap-1 rounded-xl bg-secondary/70 px-2.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="hidden sm:inline">{SEARCH_ENGINES[settings.searchEngine].name}</span>
            <span className="sm:hidden">{SEARCH_ENGINES[settings.searchEngine].name.slice(0, 1)}</span>
            <ChevronDown className="size-3" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={settings.searchEngine}
              onValueChange={(v) => update({ searchEngine: v as SearchEngineId })}
            >
              {Object.entries(SEARCH_ENGINES).map(([id, engine]) => (
                <DropdownMenuRadioItem key={id} value={id}>
                  {engine.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="mt-2 text-center text-[0.68rem] text-muted-foreground">
        Comece a digitar a qualquer momento • CTRL + K para focar
      </p>
    </form>
  );
});
