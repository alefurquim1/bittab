import { useCallback, useEffect, useState } from "react";
import { Cloud, CloudFog, CloudRain, CloudSun, CloudLightning, Droplets, RefreshCw, Snowflake, Sun } from "lucide-react";
import { useStore } from "@/hooks/useSettings";
import { getWeather } from "@/services/weatherService";
import type { Weather } from "@/types";

const ICONS = {
  sun: Sun,
  cloud: Cloud,
  "cloud-sun": CloudSun,
  rain: CloudRain,
  snow: Snowflake,
  storm: CloudLightning,
  fog: CloudFog,
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
              <p className="truncate text-sm font-medium">{data.city}</p>
            </div>
          </div>
          <p className="mt-2 truncate text-xs text-muted-foreground">{data.condition}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="size-3.5" aria-hidden /> Umidade {data.humidity}%
          </p>
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
