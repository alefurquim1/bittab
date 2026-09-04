import type { Language, Weather, WeatherAlert } from "@/types";

/**
 * Weather service layer. Components never call APIs directly.
 * Uses Open-Meteo (free, no API key): geocoding + current conditions.
 */

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const FALLBACK_CITY = "São Paulo";

const LANG_INDEX: Record<Language, 0 | 1 | 2> = { "pt-BR": 0, en: 1, es: 2 };
const GEO_LANG: Record<Language, string> = { "pt-BR": "pt", en: "en", es: "es" };

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

type Trio = [string, string, string];

/** WMO weather codes -> icon + label per language [pt, en, es] */
const CODES: Record<number, { icon: Weather["icon"]; labels: Trio }> = {
  0: { icon: "sun", labels: ["Céu limpo", "Clear sky", "Cielo despejado"] },
  1: { icon: "sun", labels: ["Predominantemente limpo", "Mainly clear", "Mayormente despejado"] },
  2: { icon: "cloud-sun", labels: ["Parcialmente nublado", "Partly cloudy", "Parcialmente nublado"] },
  3: { icon: "cloud", labels: ["Nublado", "Overcast", "Nublado"] },
  45: { icon: "fog", labels: ["Neblina", "Fog", "Niebla"] },
  48: { icon: "fog", labels: ["Neblina com gelo", "Freezing fog", "Niebla helada"] },
  51: { icon: "rain", labels: ["Garoa leve", "Light drizzle", "Llovizna ligera"] },
  53: { icon: "rain", labels: ["Garoa", "Drizzle", "Llovizna"] },
  55: { icon: "rain", labels: ["Garoa intensa", "Heavy drizzle", "Llovizna intensa"] },
  56: { icon: "rain", labels: ["Garoa congelante", "Freezing drizzle", "Llovizna helada"] },
  57: { icon: "rain", labels: ["Garoa congelante intensa", "Heavy freezing drizzle", "Llovizna helada intensa"] },
  61: { icon: "rain", labels: ["Chuva leve", "Light rain", "Lluvia ligera"] },
  63: { icon: "rain", labels: ["Chuva", "Rain", "Lluvia"] },
  65: { icon: "rain", labels: ["Chuva forte", "Heavy rain", "Lluvia fuerte"] },
  66: { icon: "rain", labels: ["Chuva congelante", "Freezing rain", "Lluvia helada"] },
  67: { icon: "rain", labels: ["Chuva congelante forte", "Heavy freezing rain", "Lluvia helada fuerte"] },
  71: { icon: "snow", labels: ["Neve leve", "Light snow", "Nieve ligera"] },
  73: { icon: "snow", labels: ["Neve", "Snow", "Nieve"] },
  75: { icon: "snow", labels: ["Neve forte", "Heavy snow", "Nieve fuerte"] },
  77: { icon: "snow", labels: ["Grãos de neve", "Snow grains", "Granos de nieve"] },
  80: { icon: "rain", labels: ["Pancadas de chuva", "Rain showers", "Chubascos"] },
  81: { icon: "rain", labels: ["Pancadas de chuva", "Rain showers", "Chubascos"] },
  82: { icon: "rain", labels: ["Pancadas fortes de chuva", "Violent rain showers", "Chubascos fuertes"] },
  85: { icon: "snow", labels: ["Pancadas de neve", "Snow showers", "Chubascos de nieve"] },
  86: { icon: "snow", labels: ["Pancadas fortes de neve", "Heavy snow showers", "Chubascos fuertes de nieve"] },
  95: { icon: "storm", labels: ["Tempestade", "Thunderstorm", "Tormenta"] },
  96: { icon: "storm", labels: ["Tempestade com granizo", "Thunderstorm with hail", "Tormenta con granizo"] },
  99: {
    icon: "storm",
    labels: ["Tempestade com granizo forte", "Thunderstorm with heavy hail", "Tormenta con granizo fuerte"],
  },
};

const TEXTS = {
  geoFail: [
    "Não foi possível buscar a cidade.",
    "Could not look up the city.",
    "No se pudo buscar la ciudad.",
  ] as Trio,
  notFound: ["Cidade não encontrada.", "City not found.", "Ciudad no encontrada."] as Trio,
  weatherFail: [
    "Não foi possível obter o clima agora.",
    "Could not get the weather right now.",
    "No se pudo obtener el clima ahora.",
  ] as Trio,
  stormTitle: ["Risco de tempestade", "Storm risk", "Riesgo de tormenta"] as Trio,
  stormDetail: [
    "Evite áreas abertas e desligue equipamentos sensíveis.",
    "Avoid open areas and unplug sensitive equipment.",
    "Evita áreas abiertas y desconecta equipos sensibles.",
  ] as Trio,
  windTitle: ["Rajadas de {n} km/h", "Gusts of {n} km/h", "Rachas de {n} km/h"] as Trio,
  windDetail: [
    "Fixe objetos soltos e cuidado com quedas de energia.",
    "Secure loose objects and watch out for power outages.",
    "Asegura objetos sueltos y cuidado con cortes de luz.",
  ] as Trio,
  rainTitle: ["{n}% de chance de chuva", "{n}% chance of rain", "{n}% de probabilidad de lluvia"] as Trio,
  rainDetail: [
    "Leve guarda-chuva e proteja seus equipamentos.",
    "Take an umbrella and protect your gear.",
    "Lleva paraguas y protege tus equipos.",
  ] as Trio,
  heatTitle: ["Calor intenso", "Intense heat", "Calor intenso"] as Trio,
  heatDetail: [
    "Hidrate-se e evite exposição ao sol no meio do dia.",
    "Stay hydrated and avoid midday sun exposure.",
    "Hidrátate y evita el sol del mediodía.",
  ] as Trio,
  coldTitle: ["Frio intenso", "Intense cold", "Frío intenso"] as Trio,
  coldDetail: [
    "Agasalhe-se bem e atenção ao risco de geada.",
    "Dress warmly and watch out for frost.",
    "Abrígate bien y atención al riesgo de heladas.",
  ] as Trio,
  uvTitle: ["Índice UV {n}", "UV index {n}", "Índice UV {n}"] as Trio,
  uvDetail: [
    "Use protetor solar e evite o sol entre 10h e 16h.",
    "Use sunscreen and avoid the sun between 10am and 4pm.",
    "Usa protector solar y evita el sol entre 10 y 16 h.",
  ] as Trio,
  dryTitle: ["Ar seco", "Dry air", "Aire seco"] as Trio,
  dryDetail: [
    "Beba água com frequência; risco de desconforto respiratório.",
    "Drink water often; risk of respiratory discomfort.",
    "Bebe agua con frecuencia; riesgo de molestias respiratorias.",
  ] as Trio,
};

function pick(trio: Trio, lang: Language, vars?: Record<string, number | string>) {
  const raw = trio[LANG_INDEX[lang] ?? 0] ?? trio[0];
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? ""));
}

function describe(code: number, lang: Language) {
  const entry = CODES[code];
  if (!entry) return { label: "—", icon: "cloud" as Weather["icon"] };
  return { label: pick(entry.labels, lang), icon: entry.icon };
}

export class WeatherError extends Error {}

async function geocode(city: string, lang: Language) {
  const q = city.trim() || FALLBACK_CITY;
  const res = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(q)}&count=1&language=${GEO_LANG[lang] ?? "pt"}&format=json`,
  );
  if (!res.ok) throw new WeatherError(pick(TEXTS.geoFail, lang));
  const data = (await res.json()) as GeoResponse;
  const hit = data.results?.[0];
  if (!hit || typeof hit.latitude !== "number" || typeof hit.longitude !== "number") {
    throw new WeatherError(pick(TEXTS.notFound, lang));
  }
  return {
    name: hit.name ?? q,
    latitude: hit.latitude,
    longitude: hit.longitude,
    region: hit.admin1 ?? hit.country_code ?? "",
  };
}

/** Builds readable alerts from real measurements (no third-party alert feed needed). */
function buildAlerts(
  w: {
    code: number;
    temperature: number;
    feelsLike: number;
    gusts: number;
    precipitationChance: number;
    uvIndex: number;
    humidity: number;
  },
  lang: Language,
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (w.code >= 95) {
    alerts.push({
      id: "storm",
      level: "severe",
      title: pick(TEXTS.stormTitle, lang),
      detail: pick(TEXTS.stormDetail, lang),
    });
  }
  if (w.gusts >= 60) {
    alerts.push({
      id: "wind",
      level: w.gusts >= 90 ? "severe" : "warning",
      title: pick(TEXTS.windTitle, lang, { n: Math.round(w.gusts) }),
      detail: pick(TEXTS.windDetail, lang),
    });
  }
  if (w.precipitationChance >= 70) {
    alerts.push({
      id: "rain",
      level: "warning",
      title: pick(TEXTS.rainTitle, lang, { n: Math.round(w.precipitationChance) }),
      detail: pick(TEXTS.rainDetail, lang),
    });
  }
  if (w.temperature >= 35 || w.feelsLike >= 38) {
    alerts.push({
      id: "heat",
      level: w.temperature >= 39 ? "severe" : "warning",
      title: pick(TEXTS.heatTitle, lang),
      detail: pick(TEXTS.heatDetail, lang),
    });
  }
  if (w.temperature <= 5) {
    alerts.push({
      id: "cold",
      level: w.temperature <= 0 ? "severe" : "warning",
      title: pick(TEXTS.coldTitle, lang),
      detail: pick(TEXTS.coldDetail, lang),
    });
  }
  if (w.uvIndex >= 8) {
    alerts.push({
      id: "uv",
      level: w.uvIndex >= 11 ? "severe" : "warning",
      title: pick(TEXTS.uvTitle, lang, { n: Math.round(w.uvIndex) }),
      detail: pick(TEXTS.uvDetail, lang),
    });
  }
  if (w.humidity <= 30) {
    alerts.push({
      id: "dry",
      level: "info",
      title: pick(TEXTS.dryTitle, lang),
      detail: pick(TEXTS.dryDetail, lang),
    });
  }

  return alerts;
}

/** Current weather for a city name. Throws WeatherError with a readable message. */
export async function getWeather(city: string, lang: Language = "pt-BR"): Promise<Weather> {
  const place = await geocode(city, lang);
  const res = await fetch(
    `${FORECAST_URL}?latitude=${place.latitude}&longitude=${place.longitude}` +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code," +
      "wind_speed_10m,wind_gusts_10m,precipitation_probability" +
      "&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max" +
      "&forecast_days=1&timezone=auto",
  );
  if (!res.ok) throw new WeatherError(pick(TEXTS.weatherFail, lang));
  const data = (await res.json()) as ForecastResponse;
  const cur = data.current;
  const temp = cur?.temperature_2m;
  if (typeof temp !== "number") throw new WeatherError(pick(TEXTS.weatherFail, lang));

  const code = cur?.weather_code ?? 3;
  const { label, icon } = describe(code, lang);
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
    alerts: buildAlerts({ code, temperature, feelsLike, gusts, precipitationChance, uvIndex, humidity }, lang),
    icon,
    demo: false,
  };
}
