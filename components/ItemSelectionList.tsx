import { Signal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { NutritionItem, NutritionUtils } from "../types.ts";

export function ItemSelectionList({
  allItems,
  selection,
}: {
  allItems: NutritionItem[];
  selection: Signal<{ [key: string]: number }>;
}) {
  function add(key: string) {
    selection.value = {
      ...selection.value,
      [key]: (selection.value[key] || 0) + 1,
    };
  }

  function remove(key: string) {
    const current = selection.value[key] || 0;
    if (current <= 0) return;
    selection.value = { ...selection.value, [key]: current - 1 };
  }

  return (
    <div class="space-y-2 mb-8">
      {allItems.map((item) => (
        <div key={item.name} class="border-b pb-2">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-semibold text-gray-300">
                {item.brand} {item.name}
              </div>
              <div class="text-sm text-gray-400">
                {NutritionUtils.getServingSizeString(item)}
                {" — "}
                {item.nutritionFactsPerServing.carbohydratesGrams}g carbs
                {" — "}
                {NutritionUtils.getSodiumMilligrams(item)} mg sodium
                {"equatesToMilliliters" in item
                  ? ` — ${item.equatesToMilliliters} ml fluid`
                  : ""}
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <Button onClick={() => remove(item.name)}>-</Button>
              <span class="font-mono">{selection.value[item.name] || 0}</span>
              <Button onClick={() => add(item.name)}>+</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
