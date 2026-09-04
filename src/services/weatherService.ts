import type { Weather, WeatherAlert } from "@/types";

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
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    wind_gusts_10m?: number;
    precipitation_probability?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    uv_index_max?: number[];
    precipitation_probability_max?: number[];
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

/** Builds readable alerts from real measurements (no third-party alert feed needed). */
function buildAlerts(w: {
  code: number;
  temperature: number;
  feelsLike: number;
  gusts: number;
  precipitationChance: number;
  uvIndex: number;
  humidity: number;
}): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (w.code >= 95) {
    alerts.push({
      id: "storm",
      level: "severe",
      title: "Risco de tempestade",
      detail: "Evite áreas abertas e desligue equipamentos sensíveis.",
    });
  }
  if (w.gusts >= 60) {
    alerts.push({
      id: "wind",
      level: w.gusts >= 90 ? "severe" : "warning",
      title: `Rajadas de ${Math.round(w.gusts)} km/h`,
      detail: "Fixe objetos soltos e cuidado com quedas de energia.",
    });
  }
  if (w.precipitationChance >= 70) {
    alerts.push({
      id: "rain",
      level: "warning",
      title: `${Math.round(w.precipitationChance)}% de chance de chuva`,
      detail: "Leve guarda-chuva e proteja seus equipamentos.",
    });
  }
  if (w.temperature >= 35 || w.feelsLike >= 38) {
    alerts.push({
      id: "heat",
      level: w.temperature >= 39 ? "severe" : "warning",
      title: "Calor intenso",
      detail: "Hidrate-se e evite exposição ao sol no meio do dia.",
    });
  }
  if (w.temperature <= 5) {
    alerts.push({
      id: "cold",
      level: w.temperature <= 0 ? "severe" : "warning",
      title: "Frio intenso",
      detail: "Agasalhe-se bem e atenção ao risco de geada.",
    });
  }
  if (w.uvIndex >= 8) {
    alerts.push({
      id: "uv",
      level: w.uvIndex >= 11 ? "severe" : "warning",
      title: `Índice UV ${Math.round(w.uvIndex)}`,
      detail: "Use protetor solar e evite o sol entre 10h e 16h.",
    });
  }
  if (w.humidity <= 30) {
    alerts.push({
      id: "dry",
      level: "info",
      title: "Ar seco",
      detail: "Beba água com frequência; risco de desconforto respiratório.",
    });
  }

  return alerts;
}

/** Current weather for a city name. Throws WeatherError with a readable message. */
export async function getWeather(city: string): Promise<Weather> {
  const place = await geocode(city);
  const res = await fetch(
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code," +
      "wind_speed_10m,wind_gusts_10m,precipitation_probability" +
      "&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max" +
      "&forecast_days=1&timezone=auto",
  );
  if (!res.ok) throw new WeatherError("Não foi possível obter o clima agora.");
  const data = (await res.json()) as ForecastResponse;
  const cur = data.current;
  const temp = cur?.temperature_2m;
  if (typeof temp !== "number") throw new WeatherError("Não foi possível obter o clima agora.");

  const code = cur?.weather_code ?? 3;
  const { label, icon } = describe(code);
  const daily = data.daily;
  const humidity = Math.round(cur?.relative_humidity_2m ?? 0);
  const gusts = Math.round(cur?.wind_gusts_10m ?? 0);
  const uvIndex = daily?.uv_index_max?.[0] ?? 0;
  const precipitationChance = Math.round(
    cur?.precipitation_probability ?? daily?.precipitation_probability_max?.[0] ?? 0,
  );
  const feelsLike = Math.round(cur?.apparent_temperature ?? temp);
  const temperature = Math.round(temp);

  return {
    city: place.name,
    region: place.region,
    temperature,
    feelsLike,
    condition: label,
    humidity,
    wind: Math.round(cur?.wind_speed_10m ?? 0),
    gusts,
    precipitationChance,
    uvIndex: Math.round(uvIndex),
    min: Math.round(daily?.temperature_2m_min?.[0] ?? temp),
    max: Math.round(daily?.temperature_2m_max?.[0] ?? temp),
    updatedAt: Date.now(),
    alerts: buildAlerts({ code, temperature, feelsLike, gusts, precipitationChance, uvIndex, humidity }),
    icon,
    demo: false,
  };
}
