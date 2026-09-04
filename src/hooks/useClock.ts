import { useEffect, useState } from "react";

/** Single efficient timer shared by every consumer. */
const listeners = new Set<(d: Date) => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function start() {
  if (timer) return;
  timer = setInterval(() => {
    const now = new Date();
    listeners.forEach((l) => l(now));
  }, 1000);
}

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    listeners.add(setNow);
    start();
    return () => {
      listeners.delete(setNow);
      if (listeners.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  return now;
}

/** Returns the translation key for the current greeting. */
export function greetingKey(date: Date) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "clock.morning";
  if (h >= 12 && h < 18) return "clock.afternoon";
  return "clock.evening";
}

export function formatLongDate(d: Date, locale = "pt-BR") {
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "2-digit", month: "long" }).format(d);
}

export function formatTime(d: Date, use24h: boolean, showSeconds: boolean) {
  let h = d.getHours();
  let suffix = "";
  if (!use24h) {
    suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
  }
  const parts = [use24h ? String(h).padStart(2, "0") : String(h), String(d.getMinutes()).padStart(2, "0")];
  if (showSeconds) parts.push(String(d.getSeconds()).padStart(2, "0"));
  return { time: parts.join(":"), suffix };
}
