import type { Weather } from "@/types";

/**
 * Weather service layer. Components never call APIs directly.
 * Without a configured provider key we return demo data, and any failure
 * falls back to demo data so the widget can never break the page.
 */

const DEMO: Weather = {
  city: "São Paulo",
  temperature: 22,
  condition: "Parcialmente nublado",
  humidity: 68,
  icon: "cloud-sun",
  demo: true,
};

function demoFor(city: string): Weather {
  return { ...DEMO, city: city.trim() || DEMO.city };
}

interface OpenWeatherResponse {
  name?: string;
  main?: { temp?: number; humidity?: number };
  weather?: Array<{ description?: string; id?: number }>;
}

function iconFor(id: number): Weather["icon"] {
  if (id >= 200 && id < 300) return "storm";
  if (id >= 300 && id < 600) return "rain";
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "fog";
  if (id === 800) return "sun";
  if (id === 801 || id === 802) return "cloud-sun";
  return "cloud";
}

export async function getWeather(city: string, apiKey: string): Promise<Weather> {
  if (!apiKey.trim()) return demoFor(city);
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city.trim() || DEMO.city,
      )}&units=metric&lang=pt_br&appid=${encodeURIComponent(apiKey.trim())}`,
    );
    if (!res.ok) return demoFor(city);
    const data = (await res.json()) as OpenWeatherResponse;
    const temp = data.main?.temp;
    if (typeof temp !== "number") return demoFor(city);
    const condition = data.weather?.[0]?.description ?? "—";
    return {
      city: data.name ?? city,
      temperature: Math.round(temp),
      condition: condition.charAt(0).toUpperCase() + condition.slice(1),
      humidity: Math.round(data.main?.humidity ?? 0),
      icon: iconFor(data.weather?.[0]?.id ?? 800),
      demo: false,
    };
  } catch {
    return demoFor(city);
  }
}
