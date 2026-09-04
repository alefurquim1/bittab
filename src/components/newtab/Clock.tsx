import { formatLongDate, formatTime, greetingFor, useClock } from "@/hooks/useClock";
import { useStore } from "@/hooks/useSettings";

export function Clock() {
  const now = useClock();
  const { settings } = useStore();

  if (!now) {
    return <div className="h-[9.5rem] sm:h-[12rem]" aria-hidden />;
  }

  const { time, suffix } = formatTime(now, settings.clock24h, settings.showSeconds);

  return (
    <div className="rise-in text-center">
      <p className="text-sm font-medium text-muted-foreground sm:text-base">
        {greetingFor(now)}
        {settings.userName.trim() ? `, ${settings.userName.trim()}` : ""}
      </p>
      <h1
        className="clock-digits mt-1 flex items-baseline justify-center gap-2 text-6xl font-semibold sm:text-8xl"
        aria-label={`Horário atual ${time}`}
      >
        {time}
        {suffix && <span className="text-lg font-medium text-muted-foreground sm:text-2xl">{suffix}</span>}
      </h1>
      {settings.showDate && (
        <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-muted-foreground sm:text-xs">
          {formatLongDate(now)}
        </p>
      )}
    </div>
  );
}
