import { Eraser } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/useSettings";

export default function NotesWidget() {
  const { notes, setNotes } = useStore();

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Notas rápidas</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="Limpar notas"
          onClick={() => setNotes("")}
        >
          <Eraser className="size-3.5" aria-hidden />
        </Button>
      </div>
      <Textarea
        id="quick-notes"
        aria-label="Notas rápidas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Responder cliente…"
        className="mt-3 min-h-28 resize-none border-glass-border bg-transparent text-sm"
      />
      <p className="mt-2 text-[0.66rem] text-muted-foreground">Salvo automaticamente neste navegador.</p>
    </article>
  );
}
