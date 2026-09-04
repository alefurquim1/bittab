import { useCallback, useEffect, useRef } from "react";
import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useSettings";
import type { PomodoroPhase } from "@/types";

const PHASES = {
  focus: { label: "Foco", minutes: 25 },
  break: { label: "Pausa", minutes: 5 },
  long: { label: "Pausa longa", minutes: 15 },
} as const;

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export default function PomodoroWidget() {
  const { pomodoro, setPomodoro } = useStore();
  const { phase, running, remaining, completed } = pomodoro;
  const total = PHASES[phase].minutes * 60;

  const switchPhase = useCallback(
    (next: PomodoroPhase, autoStart = false) =>
      setPomodoro((prev) => ({
        ...prev,
        phase: next,
        remaining: PHASES[next].minutes * 60,
        running: autoStart,
      })),
    [setPomodoro],
  );

  const finishedRef = useRef(false);

  // Single timer drives the countdown.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setPomodoro((prev) => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, setPomodoro]);

  // Phase transition when the countdown hits zero.
  useEffect(() => {
    if (remaining > 0) {
      finishedRef.current = false;
      return;
    }
    if (!running || finishedRef.current) return;
    finishedRef.current = true;
    if (phase === "focus") {
      const done = completed + 1;
      const next: PomodoroPhase = done % 4 === 0 ? "long" : "break";
      setPomodoro((prev) => ({
        ...prev,
        completed: done,
        phase: next,
        remaining: PHASES[next].minutes * 60,
        running: false,
      }));
    } else {
      switchPhase("focus");
    }
  }, [remaining, running, phase, completed, setPomodoro, switchPhase]);

  const progress = total === 0 ? 0 : 1 - remaining / total;

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Pomodoro</h3>
        <span className="text-[0.66rem] text-muted-foreground">{completed} ciclo{completed === 1 ? "" : "s"}</span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div
          className="grid size-16 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--accent-color) ${progress * 360}deg, color-mix(in oklab, var(--accent-color) 14%, transparent) 0deg)`,
          }}
          role="img"
          aria-label={`${PHASES[phase].label}: ${pad(Math.floor(remaining / 60))} minutos e ${pad(remaining % 60)} segundos restantes`}
        >
          <div className="grid size-[3.15rem] place-items-center rounded-full bg-background/80">
            {phase === "focus" ? (
              <Timer className="size-5 text-accent-color" aria-hidden />
            ) : (
              <Coffee className="size-5 text-accent-color" aria-hidden />
            )}
          </div>
        </div>
        <div className="min-w-0">
          <p className="clock-digits text-2xl font-semibold tabular-nums">
            {pad(Math.floor(remaining / 60))}:{pad(remaining % 60)}
          </p>
          <p className="text-xs text-muted-foreground">{PHASES[phase].label}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => setPomodoro((prev) => ({ ...prev, running: !prev.running }))}
          aria-label={running ? "Pausar Pomodoro" : "Iniciar Pomodoro"}
        >
          {running ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
          {running ? "Pausar" : "Iniciar"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Reiniciar tempo"
          onClick={() => switchPhase(phase)}
        >
          <RotateCcw className="size-3.5" aria-hidden />
        </Button>
      </div>

      <div className="mt-2 flex gap-1">
        {(Object.keys(PHASES) as PomodoroPhase[]).map((p) => (
          <Button
            key={p}
            variant={p === phase ? "secondary" : "ghost"}
            size="sm"
            className="h-7 flex-1 px-1 text-[0.66rem]"
            onClick={() => switchPhase(p)}
          >
            {PHASES[p].label}
          </Button>
        ))}
      </div>
    </article>
  );
}
