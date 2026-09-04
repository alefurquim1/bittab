import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SettingsProvider, useStore } from "@/hooks/useSettings";
import { BackgroundManager } from "@/components/newtab/BackgroundManager";
import { Header } from "@/components/newtab/Header";
import { Clock } from "@/components/newtab/Clock";
import { SearchBar } from "@/components/newtab/SearchBar";
import { ShortcutGrid } from "@/components/newtab/ShortcutGrid";
import { SettingsPanel } from "@/components/newtab/SettingsPanel";

const WeatherWidget = lazy(() => import("@/components/newtab/WeatherWidget"));
const NotesWidget = lazy(() => import("@/components/newtab/NotesWidget"));
const ToolsWidget = lazy(() => import("@/components/newtab/ToolsWidget"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "bit01tec • Nova Guia — Relógio, Busca e Atalhos" },
      {
        name: "description",
        content:
          "Nova guia personalizada com relógio, busca multi-mecanismo, atalhos, clima e notas rápidas. Tudo salvo apenas no seu navegador.",
      },
      { property: "og:title", content: "bit01tec • Sua nova guia, do seu jeito" },
      {
        property: "og:description",
        content:
          "Página inicial focada em produtividade: relógio, pesquisa, atalhos, clima, notas e personalização completa.",
      },
    ],
  }),
  component: NewTabPage,
});

function NewTabPage() {
  return (
    <SettingsProvider>
      <NewTab />
      <Toaster />
    </SettingsProvider>
  );
}

function WidgetFallback() {
  return <div className="glass h-40 animate-pulse rounded-2xl" aria-hidden />;
}

function NewTab() {
  const { settings } = useStore();
  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState("geral");
  const searchRef = useRef<HTMLInputElement>(null);

  const openSettings = useCallback((next: string) => {
    setTab(next);
    setPanelOpen(true);
  }, []);

  // Autofocus the search field, plus CTRL+K and type-to-search.
  useEffect(() => {
    searchRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey || panelOpen) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.key.length === 1) searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  const widgets = settings.widgets;
  const anyWidget = widgets.weather || widgets.notes || widgets.tools;

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundManager />
      <Header onOpenSettings={openSettings} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-8 px-4 py-6 sm:gap-10 sm:px-8 sm:py-10">
        <Clock />
        <SearchBar ref={searchRef} />
        {widgets.shortcuts && <ShortcutGrid />}

        {anyWidget && (
          <section
            aria-label="Widgets"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {widgets.weather && (
              <Suspense fallback={<WidgetFallback />}>
                <WeatherWidget />
              </Suspense>
            )}
            {widgets.notes && (
              <Suspense fallback={<WidgetFallback />}>
                <NotesWidget />
              </Suspense>
            )}
            {widgets.tools && (
              <Suspense fallback={<WidgetFallback />}>
                <ToolsWidget />
              </Suspense>
            )}
          </section>
        )}
      </main>

      <footer className="px-4 py-5 text-center text-[0.66rem] text-muted-foreground sm:px-8">
        bit01tec • Sua nova guia, do seu jeito.
        <span className="mx-1.5 opacity-40">|</span>
        Tecnologia, Segurança &amp; Produtividade
      </footer>

      <SettingsPanel open={panelOpen} tab={tab} onOpenChange={setPanelOpen} onTabChange={setTab} />
    </div>
  );
}
