import { useCallback, useRef, useState } from "react";
import { Activity, ArrowDownToLine, ArrowUpFromLine, ExternalLink, Gauge, Play, Timer } from "lucide-react";
import { useI18n } from "@/hooks/useSettings";

type Phase = "idle" | "latency" | "download" | "upload" | "done" | "error";

const DOWN = "https://speed.cloudflare.com/__down?bytes=";
const UP = "https://speed.cloudflare.com/__up";
const PING = "https://speed.cloudflare.com/__down?bytes=1000";

function mbps(bytes: number, ms: number) {
  if (ms <= 0) return 0;
  return (bytes * 8) / (ms / 1000) / 1_000_000;
}

async function measureLatency(samples = 5) {
  const values: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now();
    await fetch(`${PING}&cb=${Math.random()}`, { cache: "no-store" });
    values.push(performance.now() - t0);
  }
  values.sort((a, b) => a - b);
  const best = values.slice(0, Math.max(1, values.length - 1));
  const avg = best.reduce((a, b) => a + b, 0) / best.length;
  const jitter =
    best.reduce((acc, v) => acc + Math.abs(v - avg), 0) / best.length;
  return { latency: avg, jitter };
}

async function measureDownload(bytes: number) {
  const t0 = performance.now();
  const res = await fetch(`${DOWN}${bytes}&cb=${Math.random()}`, { cache: "no-store" });
  const buf = await res.arrayBuffer();
  return mbps(buf.byteLength, performance.now() - t0);
}

async function measureUpload(bytes: number) {
  const payload = new Uint8Array(bytes);
  const t0 = performance.now();
  await fetch(UP, { method: "POST", body: payload, cache: "no-store" });
  return mbps(bytes, performance.now() - t0);
}

export default function SpeedTestWidget() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<Phase>("idle");
  const [latency, setLatency] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [down, setDown] = useState<number | null>(null);
  const [up, setUp] = useState<number | null>(null);
  const running = useRef(false);

  const fmt = useCallback(
    (v: number, digits = 1) => v.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }),
    [locale],
  );

  const run = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    setLatency(null);
    setJitter(null);
    setDown(null);
    setUp(null);
    try {
      setPhase("latency");
      const l = await measureLatency();
      setLatency(l.latency);
      setJitter(l.jitter);

      setPhase("download");
      const warm = await measureDownload(1_000_000);
      const bytes = warm > 50 ? 25_000_000 : warm > 10 ? 10_000_000 : 3_000_000;
      const d = await measureDownload(bytes);
      setDown(Math.max(d, warm));

      setPhase("upload");
      const u = await measureUpload(d > 20 ? 5_000_000 : 1_500_000);
      setUp(u);

      setPhase("done");
    } catch {
      setPhase("error");
    } finally {
      running.current = false;
    }
  }, []);

  const busy = phase === "latency" || phase === "download" || phase === "upload";

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {t("speed.title")}
        </h3>
        <Gauge className="text-accent-color size-4 shrink-0" aria-hidden />
      </div>

      <p className="mt-2 text-[0.66rem] text-muted-foreground">{t("speed.desc")}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric
          icon={<ArrowDownToLine className="size-3.5 shrink-0" aria-hidden />}
          label={t("speed.download")}
          value={down != null ? `${fmt(down)} Mbps` : "—"}
          active={phase === "download"}
        />
        <Metric
          icon={<ArrowUpFromLine className="size-3.5 shrink-0" aria-hidden />}
          label={t("speed.upload")}
          value={up != null ? `${fmt(up)} Mbps` : "—"}
          active={phase === "upload"}
        />
        <Metric
          icon={<Timer className="size-3.5 shrink-0" aria-hidden />}
          label={t("speed.latency")}
          value={latency != null ? `${fmt(latency, 0)} ms` : "—"}
          active={phase === "latency"}
        />
        <Metric
          icon={<Activity className="size-3.5 shrink-0" aria-hidden />}
          label={t("speed.jitter")}
          value={jitter != null ? `${fmt(jitter, 0)} ms` : "—"}
          active={phase === "latency"}
        />
      </div>

      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-glass-border bg-secondary/50 px-3 py-2 text-xs font-semibold transition hover:text-accent-color disabled:opacity-60"
      >
        <Play className={`size-3.5 ${busy ? "animate-pulse" : ""}`} aria-hidden />
        {busy ? t(`speed.phase.${phase}`) : phase === "done" ? t("speed.again") : t("speed.start")}
      </button>

      {phase === "error" && (
        <p className="mt-2 text-[0.66rem] text-muted-foreground">{t("speed.error")}</p>
      )}
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-2.5 py-2 ${active ? "border-accent-color/50 bg-secondary/40" : "border-glass-border"}`}
    >
      <div className="flex items-center gap-1 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="clock-digits mt-1 text-base font-semibold leading-none">{value}</p>
    </div>
  );
}
