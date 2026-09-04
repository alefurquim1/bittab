import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_SHORTCUTS, useStore } from "@/hooks/useSettings";
import { parseUrl } from "@/services/searchService";
import type { Shortcut } from "@/types";
import { ShortcutCard } from "./ShortcutCard";

export function ShortcutGrid() {
  const { shortcuts, setShortcuts } = useStore();
  const [editing, setEditing] = useState<Shortcut | null>(null);
  const [open, setOpen] = useState(false);
  const dragFrom = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function save(form: HTMLFormElement) {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const rawUrl = String(data.get("url") ?? "");
    const rawIcon = String(data.get("icon") ?? "").trim();
    const url = parseUrl(rawUrl);
    if (!name || !url) {
      toast.error("Informe um nome e um endereço válido (http/https).");
      return;
    }
    const icon = rawIcon ? (parseUrl(rawIcon) ?? "") : "";
    if (editing) {
      setShortcuts((prev) => prev.map((s) => (s.id === editing.id ? { ...s, name, url, icon } : s)));
      toast.success("Atalho atualizado.");
    } else {
      setShortcuts((prev) => [...prev, { id: crypto.randomUUID(), name, url, icon }]);
      toast.success("Atalho adicionado.");
    }
    setOpen(false);
    setEditing(null);
  }

  function reorder(to: number) {
    const from = dragFrom.current;
    if (from == null || from === to) return;
    setShortcuts((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      if (moved) next.splice(to, 0, moved);
      return next;
    });
    dragFrom.current = to;
  }

  return (
    <section aria-labelledby="shortcuts-title" className="rise-in w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="shortcuts-title" className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Seus atalhos
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => {
            if (shortcuts.length >= MAX_SHORTCUTS) {
              toast.error(`Limite de ${MAX_SHORTCUTS} atalhos atingido.`);
              return;
            }
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-3.5" aria-hidden /> Adicionar atalho
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {shortcuts.map((s, i) => (
          <ShortcutCard
            key={s.id}
            shortcut={s}
            dragging={dragIndex === i}
            onDragStart={() => {
              dragFrom.current = i;
              setDragIndex(i);
            }}
            onDragEnter={() => reorder(i)}
            onDrop={() => {
              dragFrom.current = null;
              setDragIndex(null);
            }}
            onEdit={() => {
              setEditing(s);
              setOpen(true);
            }}
            onRemove={() => {
              setShortcuts((prev) => prev.filter((x) => x.id !== s.id));
              toast.success("Atalho removido.");
            }}
          />
        ))}
      </div>
      <p className="mt-2 text-[0.66rem] text-muted-foreground">
        Arraste os atalhos para reorganizar • até {MAX_SHORTCUTS} itens
      </p>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar atalho" : "Novo atalho"}</DialogTitle>
            <DialogDescription>Os atalhos ficam salvos apenas neste navegador.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save(e.currentTarget);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="sc-name">Nome</Label>
              <Input id="sc-name" name="name" defaultValue={editing?.name ?? ""} placeholder="GitHub" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-url">URL</Label>
              <Input id="sc-url" name="url" defaultValue={editing?.url ?? ""} placeholder="https://github.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sc-icon">Ícone (URL, opcional)</Label>
              <Input id="sc-icon" name="icon" defaultValue={editing?.icon ?? ""} placeholder="https://.../icone.png" />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
