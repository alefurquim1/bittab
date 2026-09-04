import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  RefreshCw,
  Snowflake,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react";
import { useStore } from "@/hooks/useSettings";
import { getWeather } from "@/services/weatherService";
import type { Weather, WeatherAlertLevel } from "@/types";

const ICONS = {
  sun: Sun,
  cloud: Cloud,
  "cloud-sun": CloudSun,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning,
  fog: CloudFog,
};

const LEVEL_STYLE: Record<WeatherAlertLevel, string> = {
  info: "border-glass-border text-muted-foreground",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  severe: "border-red-500/45 bg-red-500/10 text-red-200",
};

const REFRESH_MS = 10 * 60 * 1000;

export default function WeatherWidget() {
  const { settings } = useStore();
  const city = settings.weatherCity;
  const [data, setData] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getWeather(city)
      .then((w) => {
        if (!active) return;
        setData(w);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Falha ao carregar o clima.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [city, tick]);

  useEffect(() => {
    const id = window.setInterval(reload, REFRESH_MS);
    return () => window.clearInterval(id);
  }, [reload]);

  const Icon = data ? ICONS[data.icon] : Cloud;

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Clima</h3>
        <button
          type="button"
          onClick={reload}
          aria-label="Atualizar clima"
          className="text-muted-foreground transition hover:text-foreground"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
        </button>
      </div>

      {data ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <Icon className="text-accent-color size-9 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="clock-digits text-3xl font-semibold leading-none">{data.temperature}°C</p>
              <p className="truncate text-sm font-medium">
                {data.city}
                {data.region && <span className="text-muted-foreground"> • {data.region}</span>}
              </p>
            </div>
          </div>

          <p className="mt-2 truncate text-xs text-muted-foreground">
            {data.condition} • sensação {data.feelsLike}°C • {data.min}° / {data.max}°
          </p>

          <dl className="mt-2 grid grid-cols-3 gap-2 text-[0.66rem] text-muted-foreground">
            <div className="flex items-center gap-1">
              <Droplets className="size-3.5 shrink-0" aria-hidden />
              <dt className="sr-only">Umidade</dt>
              <dd>{data.humidity}%</dd>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="size-3.5 shrink-0" aria-hidden />
              <dt className="sr-only">Vento</dt>
              <dd>{data.wind} km/h</dd>
            </div>
            <div className="flex items-center gap-1">
              <Umbrella className="size-3.5 shrink-0" aria-hidden />
              <dt className="sr-only">Chance de chuva</dt>
              <dd>{data.precipitationChance}%</dd>
            </div>
          </dl>

          {data.alerts.length > 0 ? (
            <ul className="mt-3 space-y-1.5" aria-label="Alertas do clima">
              {data.alerts.slice(0, 3).map((a) => (
                <li
                  key={a.id}
                  className={`flex gap-2 rounded-lg border px-2 py-1.5 text-[0.66rem] ${LEVEL_STYLE[a.level]}`}
                >
                  {a.level === "info" ? (
                    <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                  ) : (
                    <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden />
                  )}
                  <span>
                    <strong className="font-semibold">{a.title}.</strong> {a.detail}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.66rem] text-muted-foreground">Sem alertas para agora.</p>
          )}

          {error && <p className="mt-2 text-[0.66rem] text-muted-foreground">{error}</p>}
        </>
      ) : error ? (
        <p className="mt-3 text-sm text-muted-foreground">{error}</p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Carregando…</p>
      )}
    </article>
  );
}
