export type SearchEngineId = "google" | "bing" | "duckduckgo" | "brave" | "ecosia";

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export interface QuickTool {
  id: string;
  name: string;
  url: string;
}

export type ThemeMode = "dark" | "light" | "system";

export type BackgroundKind = "solid" | "gradient" | "image" | "wallpaper";

export interface BackgroundSettings {
  kind: BackgroundKind;
  /** solid color (css color) */
  color: string;
  /** gradient css value */
  gradient: string;
  /** remote image url */
  imageUrl: string;
  /** id of preset wallpaper */
  wallpaper: string;
  /** true when a local upload is stored in IndexedDB */
  hasUpload: boolean;
  blur: number;
  opacity: number;
  dim: number;
}

export interface WidgetToggles {
  weather: boolean;
  notes: boolean;
  tools: boolean;
  shortcuts: boolean;
  tasks: boolean;
  pomodoro: boolean;
}

export interface Settings {
  userName: string;
  clock24h: boolean;
  showSeconds: boolean;
  showDate: boolean;
  theme: ThemeMode;
  accent: string;
  cardOpacity: number;
  searchEngine: SearchEngineId;
  widgets: WidgetToggles;
  weatherCity: string;
  weatherApiKey: string;
  background: BackgroundSettings;
}

export interface Weather {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  icon: "sun" | "cloud" | "cloud-sun" | "rain" | "snow" | "storm" | "fog";
  demo: boolean;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

export type PomodoroPhase = "focus" | "break" | "long";

export interface PomodoroState {
  phase: PomodoroPhase;
  running: boolean;
  /** seconds left in the current phase */
  remaining: number;
  /** completed focus cycles */
  completed: number;
}
