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

export function greetingFor(date: Date) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
}

const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];
const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function formatLongDate(d: Date) {
  return `${WEEKDAYS[d.getDay()]}, ${String(d.getDate()).padStart(2, "0")} de ${MONTHS[d.getMonth()]}`;
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
