import { Moon, Settings as SettingsIcon, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useSettings";

export function Header({ onOpenSettings }: { onOpenSettings: (tab: string) => void }) {
  const { settings, update } = useStore();
  const isDark = settings.theme !== "light";

  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="accent-glow grid size-9 shrink-0 place-items-center rounded-xl bg-secondary">
          <span className="clock-digits text-accent-color text-sm font-bold">01</span>
        </div>
        <div className="min-w-0">
          <p className="clock-digits truncate text-sm font-semibold tracking-tight">bit01tec</p>
          <p className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/70" />
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Personalizar aparência"
          onClick={() => onOpenSettings("aparencia")}
        >
          <Sparkles className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Abrir configurações" onClick={() => onOpenSettings("geral")}>
          <SettingsIcon className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          onClick={() => update({ theme: isDark ? "light" : "dark" })}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}
