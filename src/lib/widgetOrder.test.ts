import { test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { moveWidget, normalizeOrder } from "./widgetOrder";

test("moving a widget preserves every other widget", () => {
  deepStrictEqual(moveWidget(["weather", "notes", "tasks"], "tasks", "weather"), ["tasks", "weather", "notes"]);
});
test("saved order survives while new widgets are appended and stale entries removed", () => {
  deepStrictEqual(normalizeOrder(["notes", "old", "notes", "weather"], ["weather", "notes", "tasks"]), ["notes", "weather", "tasks"]);
});
test("hidden widgets retain their position in the complete order", () => {
  deepStrictEqual(moveWidget(["weather", "notes", "tasks"], "tasks", "weather"), ["tasks", "weather", "notes"]);
  deepStrictEqual(normalizeOrder(null, ["weather", "notes"]), ["weather", "notes"]);
});