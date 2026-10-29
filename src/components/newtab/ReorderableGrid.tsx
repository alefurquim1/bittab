import { useState, type ReactNode } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useI18n } from "@/hooks/useSettings";
import { moveWidget, normalizeOrder } from "@/lib/widgetOrder";

interface Props {
  storageKey: string;
  items: { id: string; label: string; content: ReactNode; hidden?: boolean }[];
  label: string;
}

export function ReorderableGrid({ storageKey, items, label }: Props) {
  const { t } = useI18n();
  const [arranging, setArranging] = useState(false);
  const { value, setValue, hydrated } = useLocalStorage<string[]>(storageKey, items.map((item) => item.id));
  const order = normalizeOrder(value, items.map((item) => item.id));
  const visible = order.flatMap((id) => {
    const item = items.find((item) => item.id === id);
    return item && !item.hidden ? [item] : [];
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  if (!visible.length) return null;

  return (
    <section aria-label={label} className="min-w-0">
      <div className="mb-3 flex justify-end">
        <Button variant="ghost" size="sm" disabled={!hydrated} aria-pressed={arranging} onClick={() => setArranging((v) => !v)}>
          {arranging ? <Check aria-hidden /> : <LayoutGrid aria-hidden />}
          {t(arranging ? "widgets.done" : "widgets.arrange")}
        </Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) setValue(moveWidget(order, String(active.id), String(over.id)));
      }}>
        <SortableContext items={visible.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <SortableWidget key={item.id} id={item.id} label={item.label} arranging={arranging}>{item.content}</SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}

function SortableWidget({ id, label, arranging, children }: { id: string; label: string; arranging: boolean; children: ReactNode }) {
  const { t } = useI18n();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !arranging });
  return (
    <div ref={setNodeRef} data-widget-id={id} className={`relative min-w-0 ${isDragging ? "z-20 opacity-75" : ""} ${arranging ? "pt-7" : ""}`} style={{ transform: CSS.Transform.toString(transform), transition }}>
      {arranging && (
        <Button ref={setActivatorNodeRef} variant="secondary" size="icon" className="absolute right-2 top-0 h-7 w-8 touch-none cursor-grab active:cursor-grabbing" title={t("widgets.move", { name: label })} aria-label={t("widgets.move", { name: label })} {...attributes} {...listeners}>
          <GripVertical aria-hidden />
        </Button>
      )}
      {children}
    </div>
  );
}