import { useCallback, useEffect, useState } from "react";
import { ArrowLeftRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/useSettings";

const CURRENCIES: Array<{ code: string; label: string }> = [
  { code: "BRL", label: "Real (BRL)" },
  { code: "USD", label: "Dólar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "Libra (GBP)" },
  { code: "ARS", label: "Peso arg. (ARS)" },
  { code: "CLP", label: "Peso chil. (CLP)" },
  { code: "JPY", label: "Iene (JPY)" },
  { code: "CNY", label: "Yuan (CNY)" },
  { code: "CHF", label: "Franco (CHF)" },
  { code: "CAD", label: "Dólar can. (CAD)" },
  { code: "AUD", label: "Dólar aus. (AUD)" },
  { code: "MXN", label: "Peso mex. (MXN)" },
  { code: "BTC", label: "Bitcoin (BTC)" },
];

const STORAGE_KEY = "bittab:currency";

interface Stored {
  from: string;
  to: string;
  amount: string;
}

function loadStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Stored>;
      return {
        from: typeof p.from === "string" ? p.from : "USD",
        to: typeof p.to === "string" ? p.to : "BRL",
        amount: typeof p.amount === "string" ? p.amount : "1",
      };
    }
  } catch {
    /* ignora dados inválidos */
  }
  return { from: "USD", to: "BRL", amount: "1" };
}

export default function CurrencyWidget() {
  const { t, locale } = useI18n();
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BRL");
  const [amount, setAmount] = useState("1");
  const [rate, setRate] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = loadStored();
    setFrom(s.from);
    setTo(s.to);
    setAmount(s.amount);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ from, to, amount }));
    } catch {
      /* armazenamento indisponível */
    }
  }, [ready, from, to, amount]);

  const fetchRate = useCallback(async () => {
    if (from === to) {
      setRate(1);
      setDate(new Date().toISOString().slice(0, 10));
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://economia.awesomeapi.com.br/last/${from}-${to}`);
      if (!res.ok) throw new Error("resposta inválida");
      const json = (await res.json()) as Record<string, { bid?: string; create_date?: string }>;
      const entry = json[`${from}${to}`];
      const bid = entry?.bid ? Number(entry.bid) : NaN;
      if (!Number.isFinite(bid)) throw new Error("par indisponível");
      setRate(bid);
      setDate(entry?.create_date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
    } catch {
      setRate(null);
      setError(t("currency.error"));
    } finally {
      setLoading(false);
    }
  }, [from, to, t]);

  useEffect(() => {
    if (!ready) return;
    void fetchRate();
    const id = window.setInterval(() => void fetchRate(), 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [ready, fetchRate]);

  const numericAmount = Number(amount.replace(",", ".")) || 0;
  const converted = rate !== null ? numericAmount * rate : null;
  const fmt = (v: number) =>
    v.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: v < 1 ? 6 : 2 });

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t("currency.title")}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={t("currency.refresh")}
          onClick={() => void fetchRate()}
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} aria-hidden />
        </Button>
      </div>

      <div className="mt-3 flex items-end gap-2">
        <label className="flex-1 text-[0.66rem] text-muted-foreground">
          {t("currency.from")}
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 w-full rounded-lg border border-glass-border bg-secondary/40 px-2 py-1.5 text-xs text-foreground"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="mb-1 size-7"
          aria-label={t("currency.swap")}
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          <ArrowLeftRight className="size-3.5" aria-hidden />
        </Button>
        <label className="flex-1 text-[0.66rem] text-muted-foreground">
          {t("currency.to")}
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-glass-border bg-secondary/40 px-2 py-1.5 text-xs text-foreground"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block text-[0.66rem] text-muted-foreground">
        {t("currency.amount")}
        <Input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 h-8 border-glass-border bg-transparent text-sm"
        />
      </label>

      {error ? (
        <p className="mt-3 text-xs text-muted-foreground">{error}</p>
      ) : (
        <div className="mt-3">
          <p className="text-lg font-semibold tabular-nums">
            {converted !== null ? `${fmt(converted)} ${to}` : "—"}
          </p>
          <p className="mt-1 text-[0.66rem] text-muted-foreground">
            {rate !== null ? `1 ${from} = ${fmt(rate)} ${to}` : t("currency.loading")}
            {date && ` • ${date.split("-").reverse().join("/")}`}
          </p>
        </div>
      )}
    </article>
  );
}
