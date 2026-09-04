import { Eraser } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useI18n, useStore } from "@/hooks/useSettings";

export default function NotesWidget() {
  const { notes, setNotes } = useStore();
  const { t } = useI18n();

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{t("notes.title")}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={t("notes.clear")}
          onClick={() => setNotes("")}
        >
          <Eraser className="size-3.5" aria-hidden />
        </Button>
      </div>
      <Textarea
        id="quick-notes"
        aria-label={t("notes.title")}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={t("notes.placeholder")}
        className="mt-3 min-h-28 resize-none border-glass-border bg-transparent text-sm"
      />
      <p className="mt-2 text-[0.66rem] text-muted-foreground">{t("notes.saved")}</p>
    </article>
  );
}
