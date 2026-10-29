import { lazy, Suspense } from "react";
import { useI18n, useStore } from "@/hooks/useSettings";
import { ReorderableGrid } from "./ReorderableGrid";

const COMPONENTS = {
  weather: lazy(() => import("./WeatherWidget")),
  notes: lazy(() => import("./NotesWidget")),
  tasks: lazy(() => import("./TasksWidget")),
  pomodoro: lazy(() => import("./PomodoroWidget")),
  currency: lazy(() => import("./CurrencyWidget")),
  speed: lazy(() => import("./SpeedTestWidget")),
  malware: lazy(() => import("./MalwareWidget")),
};

export function WidgetGrid() {
  const { settings } = useStore();
  const { t } = useI18n();
  const items = (Object.keys(COMPONENTS) as (keyof typeof COMPONENTS)[]).map((id) => {
    const Component = COMPONENTS[id];
    return {
      id, label: t(`widget.${id}`), hidden: !settings.widgets[id],
      content: <Suspense fallback={<div className="glass h-40 animate-pulse rounded-2xl" aria-hidden />}><Component /></Suspense>,
    };
  });
  return <ReorderableGrid storageKey="bittab:widgets:order" label={t("settings.tab.widgets")} items={items} />;
}