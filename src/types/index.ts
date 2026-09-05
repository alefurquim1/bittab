export type SearchEngineId = "google" | "bing" | "duckduckgo" | "brave" | "ecosia";

export type Language = "pt-BR" | "en" | "es";

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

export type ThemeMode = "dark" | "light" | "system" | "hacker";

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
  links: boolean;
  shortcuts: boolean;
  tasks: boolean;
  pomodoro: boolean;
  currency: boolean;
  speed: boolean;
}

export interface Settings {
  language: Language;
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

export type WeatherAlertLevel = "info" | "warning" | "severe";

export interface WeatherAlert {
  id: string;
  level: WeatherAlertLevel;
  title: string;
  detail: string;
}

export interface Weather {
  city: string;
  region: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  wind: number;
  gusts: number;
  precipitationChance: number;
  uvIndex: number;
  min: number;
  max: number;
  updatedAt: number;
  alerts: WeatherAlert[];
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
