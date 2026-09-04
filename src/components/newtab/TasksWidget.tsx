import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks/useSettings";

export default function TasksWidget() {
  const { tasks, setTasks } = useStore();
  const [draft, setDraft] = useState("");

  const pending = tasks.filter((t) => !t.done).length;

  function add(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <article className="glass rise-in rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Tarefas</h3>
        <span className="text-[0.66rem] text-muted-foreground">
          {pending === 0 ? "tudo feito" : `${pending} pendente${pending > 1 ? "s" : ""}`}
        </span>
      </div>

      <form className="mt-3 flex gap-2" onSubmit={add}>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nova tarefa…"
          aria-label="Nova tarefa"
          maxLength={120}
          className="h-9 border-glass-border bg-transparent text-sm"
        />
        <Button type="submit" size="icon" className="size-9 shrink-0" aria-label="Adicionar tarefa">
          <Plus className="size-4" aria-hidden />
        </Button>
      </form>

      <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto pr-1">
        {tasks.length === 0 && (
          <li className="py-2 text-xs text-muted-foreground">Nenhuma tarefa por aqui.</li>
        )}
        {tasks.map((t) => (
          <li key={t.id} className="group flex items-center gap-2 rounded-lg px-1 py-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={t.done}
              aria-label={t.done ? `Marcar "${t.title}" como pendente` : `Concluir "${t.title}"`}
              onClick={() =>
                setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))
              }
              className="flex size-4 shrink-0 items-center justify-center rounded border border-glass-border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={t.done ? { background: "var(--accent-color)", borderColor: "var(--accent-color)" } : undefined}
            >
              {t.done && <Check className="size-3 text-background" aria-hidden />}
            </button>
            <span
              className={`flex-1 truncate text-sm transition-opacity ${t.done ? "text-muted-foreground line-through opacity-60" : ""}`}
            >
              {t.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              aria-label={`Excluir ${t.title}`}
              onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          </li>
        ))}
      </ul>

      {tasks.some((t) => t.done) && (
        <button
          type="button"
          className="mt-2 text-[0.66rem] text-muted-foreground underline-offset-2 hover:underline"
          onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
        >
          Limpar concluídas
        </button>
      )}
    </article>
  );
}
