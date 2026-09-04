import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { PomodoroState, Settings, Shortcut, Task } from "@/types";

/** Verde neon fixo do tema hacker/cyberpunk. */
export const HACKER_ACCENT = "oklch(0.86 0.24 145)";

export const ACCENTS = [
  { id: "cyan", label: "Ciano", value: "oklch(0.78 0.13 205)" },
  { id: "blue", label: "Azul", value: "oklch(0.68 0.16 255)" },
  { id: "teal", label: "Verde-água", value: "oklch(0.75 0.13 175)" },
  { id: "violet", label: "Violeta", value: "oklch(0.68 0.16 290)" },
  { id: "amber", label: "Âmbar", value: "oklch(0.8 0.14 75)" },
  { id: "rose", label: "Rosé", value: "oklch(0.7 0.16 15)" },
];

export const WALLPAPERS = [
  { id: "deep", label: "Deep Space", value: "radial-gradient(120% 120% at 20% 10%, oklch(0.32 0.07 250) 0%, oklch(0.16 0.03 260) 45%, oklch(0.11 0.02 265) 100%)" },
  { id: "grid", label: "Grafite", value: "radial-gradient(110% 110% at 80% 0%, oklch(0.28 0.03 230) 0%, oklch(0.14 0.01 250) 55%, oklch(0.1 0.005 260) 100%)" },
  { id: "aurora", label: "Aurora", value: "linear-gradient(140deg, oklch(0.2 0.05 260) 0%, oklch(0.3 0.08 200) 45%, oklch(0.15 0.03 280) 100%)" },
  { id: "carbon", label: "Carbono", value: "linear-gradient(180deg, oklch(0.18 0.01 250) 0%, oklch(0.1 0.005 260) 100%)" },
];

export const DEFAULT_SETTINGS: Settings = {
  userName: "Alexandre",
  clock24h: true,
  showSeconds: false,
  showDate: true,
  theme: "dark",
  accent: "oklch(0.78 0.13 205)",
  cardOpacity: 55,
  searchEngine: "google",
  widgets: { weather: true, notes: true, links: true, shortcuts: true, tasks: true, pomodoro: true, currency: true },
  weatherCity: "São Paulo",
  weatherApiKey: "",
  background: {
    kind: "wallpaper",
    color: "#0b0d12",
    gradient: "linear-gradient(140deg, #0b0d12 0%, #131a24 100%)",
    imageUrl: "",
    wallpaper: "deep",
    hasUpload: false,
    blur: 0,
    opacity: 100,
    dim: 25,
  },
};

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: "s1", name: "Instagram Bit01Tec", url: "https://instagram.com/bit01tec" },
  { id: "s2", name: "Bit01Tec", url: "https://www.bit01tec.com.br" },
  { id: "s3", name: "Gmail", url: "https://mail.google.com" },
  { id: "s4", name: "GitHub", url: "https://github.com" },
  { id: "s5", name: "LinkedIn", url: "https://www.linkedin.com" },
  { id: "s6", name: "WhatsApp Web", url: "https://web.whatsapp.com" },
  { id: "s7", name: "Google", url: "https://www.google.com" },
  { id: "s8", name: "YouTube", url: "https://www.youtube.com" },
];

export const DEFAULT_TASKS: Task[] = [
  { id: "k1", title: "Revisar chamados do dia", done: false, createdAt: 0 },
  { id: "k2", title: "Atualizar antivírus dos clientes", done: false, createdAt: 0 },
  { id: "k3", title: "Backup do servidor", done: true, createdAt: 0 },
];

export const DEFAULT_POMODORO: PomodoroState = {
  phase: "focus",
  running: false,
  remaining: 25 * 60,
  completed: 0,
};

export const MAX_SHORTCUTS = 12;

interface Store {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  updateBackground: (patch: Partial<Settings["background"]>) => void;
  shortcuts: Shortcut[];
  setShortcuts: (next: Shortcut[] | ((prev: Shortcut[]) => Shortcut[])) => void;
  notes: string;
  setNotes: (next: string) => void;
  tasks: Task[];
  setTasks: (next: Task[] | ((prev: Task[]) => Task[])) => void;
  pomodoro: PomodoroState;
  setPomodoro: (next: PomodoroState | ((prev: PomodoroState) => PomodoroState)) => void;
  hydrated: boolean;
}

const StoreContext = createContext<Store | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const s = useLocalStorage<Settings>("bit01tec.settings", DEFAULT_SETTINGS);
  const sc = useLocalStorage<Shortcut[]>("bit01tec.shortcuts", DEFAULT_SHORTCUTS);
  const tk = useLocalStorage<Task[]>("bit01tec.tasks", DEFAULT_TASKS);
  const pm = useLocalStorage<PomodoroState>("bit01tec.pomodoro", DEFAULT_POMODORO);
  const nt = useLocalStorage<string>("bit01tec.notes", "Verificar backup do notebook\nPublicar matéria às 18h");

  const update = useCallback(
    (patch: Partial<Settings>) => s.setValue((prev) => ({ ...prev, ...patch })),
    [s],
  );
  const updateBackground = useCallback(
    (patch: Partial<Settings["background"]>) =>
      s.setValue((prev) => ({ ...prev, background: { ...prev.background, ...patch } })),
    [s],
  );

  // Theme + accent applied to the document root.
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const hacker = s.value.theme === "hacker";
      const dark =
        hacker ||
        s.value.theme === "dark" ||
        (s.value.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
      root.classList.toggle("theme-hacker", hacker);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [s.value.theme]);

  useEffect(() => {
    const root = document.documentElement;
    const hacker = s.value.theme === "hacker";
    root.style.setProperty("--accent-color", hacker ? HACKER_ACCENT : s.value.accent);
    root.style.setProperty("--card-alpha", String(s.value.cardOpacity / 100));
  }, [s.value.accent, s.value.cardOpacity, s.value.theme]);

  const value = useMemo<Store>(
    () => ({
      settings: {
        ...DEFAULT_SETTINGS,
        ...s.value,
        widgets: { ...DEFAULT_SETTINGS.widgets, ...s.value.widgets },
        background: { ...DEFAULT_SETTINGS.background, ...s.value.background },
      },
      update,
      updateBackground,
      shortcuts: sc.value,
      setShortcuts: sc.setValue,
      notes: nt.value,
      setNotes: (next: string) => nt.setValue(next),
      tasks: tk.value,
      setTasks: tk.setValue,
      pomodoro: pm.value,
      setPomodoro: pm.setValue,
      hydrated: s.hydrated && sc.hydrated,
    }),
    [s.value, s.hydrated, sc.value, sc.hydrated, sc.setValue, nt, tk.value, tk.setValue, pm.value, pm.setValue, update, updateBackground],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside SettingsProvider");
  return ctx;
}
