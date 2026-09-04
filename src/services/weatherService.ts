import type { Weather } from "@/types";

/**
 * Weather service layer. Components never call APIs directly.
 * Uses Open-Meteo (free, no API key): geocoding + current conditions.
 */

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const FALLBACK_CITY = "São Paulo";

interface GeoResponse {
  results?: Array<{ name?: string; latitude?: number; longitude?: number; country_code?: string; admin1?: string }>;
}

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
    relative_humidity_2m?: number;
    weather_code?: number;
  };
}

/** WMO weather codes -> label + icon */
const CODES: Record<number, { label: string; icon: Weather["icon"] }> = {
  0: { label: "Céu limpo", icon: "sun" },
  1: { label: "Predominantemente limpo", icon: "sun" },
  2: { label: "Parcialmente nublado", icon: "cloud-sun" },
  3: { label: "Nublado", icon: "cloud" },
  45: { label: "Neblina", icon: "fog" },
  48: { label: "Neblina com gelo", icon: "fog" },
  51: { label: "Garoa leve", icon: "rain" },
  53: { label: "Garoa", icon: "rain" },
  55: { label: "Garoa intensa", icon: "rain" },
  56: { label: "Garoa congelante", icon: "rain" },
  57: { label: "Garoa congelante intensa", icon: "rain" },
  61: { label: "Chuva leve", icon: "rain" },
  63: { label: "Chuva", icon: "rain" },
  65: { label: "Chuva forte", icon: "rain" },
  66: { label: "Chuva congelante", icon: "rain" },
  67: { label: "Chuva congelante forte", icon: "rain" },
  71: { label: "Neve leve", icon: "snow" },
  73: { label: "Neve", icon: "snow" },
  75: { label: "Neve forte", icon: "snow" },
  77: { label: "Grãos de neve", icon: "snow" },
  80: { label: "Pancadas de chuva", icon: "rain" },
  81: { label: "Pancadas de chuva", icon: "rain" },
  82: { label: "Pancadas fortes de chuva", icon: "rain" },
  85: { label: "Pancadas de neve", icon: "snow" },
  86: { label: "Pancadas fortes de neve", icon: "snow" },
  95: { label: "Tempestade", icon: "storm" },
  96: { label: "Tempestade com granizo", icon: "storm" },
  99: { label: "Tempestade com granizo forte", icon: "storm" },
};

function describe(code: number) {
  return CODES[code] ?? { label: "—", icon: "cloud" as Weather["icon"] };
}

export class WeatherError extends Error {}

async function geocode(city: string) {
  const q = city.trim() || FALLBACK_CITY;
  const res = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(q)}&count=1&language=pt&format=json`,
  );
  if (!res.ok) throw new WeatherError("Não foi possível buscar a cidade.");
  const data = (await res.json()) as GeoResponse;
  const hit = data.results?.[0];
  if (!hit || typeof hit.latitude !== "number" || typeof hit.longitude !== "number") {
    throw new WeatherError("Cidade não encontrada.");
  }
  return {
    name: hit.name ?? q,
    latitude: hit.latitude,
    longitude: hit.longitude,
    region: hit.admin1 ?? hit.country_code ?? "",
  };
}

/** Current weather for a city name. Throws WeatherError with a readable message. */
export async function getWeather(city: string): Promise<Weather> {
  const place = await geocode(city);
  const res = await fetch(
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`,
  );
  if (!res.ok) throw new WeatherError("Não foi possível obter o clima agora.");
  const data = (await res.json()) as ForecastResponse;
  const temp = data.current?.temperature_2m;
  if (typeof temp !== "number") throw new WeatherError("Não foi possível obter o clima agora.");
  const { label, icon } = describe(data.current?.weather_code ?? 3);
  return {
    city: place.name,
    temperature: Math.round(temp),
    condition: label,
    humidity: Math.round(data.current?.relative_humidity_2m ?? 0),
    icon,
    demo: false,
  };
}
