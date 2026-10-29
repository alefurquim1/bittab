export function normalizeOrder(saved: unknown, ids: string[]): string[] {
  const known = new Set(ids);
  const existing = Array.isArray(saved) ? saved.filter((id): id is string => typeof id === "string" && known.has(id)) : [];
  return [...new Set([...existing, ...ids])];
}

export function moveWidget(order: string[], from: string, to: string): string[] {
  const source = order.indexOf(from);
  const target = order.indexOf(to);
  if (source < 0 || target < 0 || source === target) return order;
  const next = [...order];
  next.splice(source, 1);
  next.splice(target, 0, from);
  return next;
}