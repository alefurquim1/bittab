import { useEffect, useState } from "react";
import { Cloud, CloudFog, CloudRain, CloudSun, CloudLightning, Droplets, Snowflake, Sun } from "lucide-react";
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

export default function WeatherWidget() {
  const { settings } = useStore();
  const [data, setData] = useState<Weather | null>(null);

  useEffect(() => {
    let active = true;
    getWeather(settings.weatherCity, settings.weatherApiKey).then((w) => {
      if (active) setData(w);
    });
    return () => {
      active = false;
    };
  }, [settings.weatherCity, settings.weatherApiKey]);

  const Icon = data ? ICONS[data.icon] : Cloud;

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Clima</h3>
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
          {data.demo && (
            <p className="mt-3 text-[0.66rem] text-muted-foreground">
              Dados demonstrativos. Configure uma API de clima nas configurações.
            </p>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Carregando…</p>
      )}
    </article>
  );
}
