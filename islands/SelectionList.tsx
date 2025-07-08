import { useState } from "preact/hooks";

import StackedBarChart, {
  BAR_COLORS,
  BarSegment,
} from "../components/StackedBarChart.tsx";
import rawCaps from "../static/data/caps.json" with { type: "json" };
import rawDrinkMixes from "../static/data/drink-mixes.json" with {
  type: "json",
};
import rawDrinks from "../static/data/drinks.json" with { type: "json" };
import rawGels from "../static/data/gels.json" with { type: "json" };
import {
  Capsule,
  Drink,
  DrinkMix,
  Gel,
  NutritionItem,
  NutritionUtils,
} from "../types.ts";

const TARGET_CARBS_GRAMS_PER_HOUR = 70;
const TARGET_SODIUM_MG_PER_LITER = 1500;
const TARGET_FLUID_ML_PER_HOUR = 600;
const EXCERCISE_DURATION_MINUTES = 60 * 8;

const TARGET_FLUID = TARGET_FLUID_ML_PER_HOUR *
  (EXCERCISE_DURATION_MINUTES / 60);
const TARGET_CARBS = TARGET_CARBS_GRAMS_PER_HOUR *
  (EXCERCISE_DURATION_MINUTES / 60);
const TARGET_SODIUM = (TARGET_FLUID / 1000) * TARGET_SODIUM_MG_PER_LITER;

const drinkMixes = rawDrinkMixes as DrinkMix[];
const drinks = rawDrinks as Drink[];
const gels = rawGels as Gel[];
const capsules = rawCaps as Capsule[]; // Assuming capsules are similar to gels

export default function SelectionList() {
  const [selection, setSelection] = useState<{ [key: string]: number }>({});

  function add(key: string) {
    setSelection((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  }

  function remove(key: string) {
    setSelection((prev) => {
      const current = prev[key] || 0;
      if (current <= 0) return prev;
      return { ...prev, [key]: current - 1 };
    });
  }

  const allItems: NutritionItem[] = [
    ...drinkMixes.map((x) => ({ ...x, type: "drinkMix" })),
    ...drinks.map((x) => ({ ...x, type: "drink" })),
    ...gels.map((x) => ({ ...x, type: "gel" })),
    ...capsules.map((x) => ({ ...x, type: "capsule" })),
  ];

  const itemColorMap = new Map<string, string>();
  let colorIndex = 0;

  function getColor(itemName: string) {
    if (!itemColorMap.has(itemName)) {
      itemColorMap.set(itemName, BAR_COLORS[colorIndex % BAR_COLORS.length]);
      colorIndex++;
    }
    return itemColorMap.get(itemName)!;
  }

  const fluidSegments: BarSegment[] = [];
  const carbSegments: BarSegment[] = [];
  const sodiumSegments: BarSegment[] = [];

  for (const item of allItems) {
    const count = selection[item.name] || 0;
    if (count <= 0) continue;

    const color = getColor(item.name);
    const fluid = NutritionUtils.getFluidVolumeMilliliters(item);
    const carbs = NutritionUtils.getCarbsGrams(item);
    const sodium = NutritionUtils.getSodiumMilligrams(item);

    if (fluid > 0) {
      fluidSegments.push({
        label: item.name,
        valuePerItem: fluid,
        itemCount: count,
        color,
      });
    }
    if (carbs > 0) {
      carbSegments.push({
        label: item.name,
        valuePerItem: carbs,
        itemCount: count,
        color,
      });
    }
    if (sodium > 0) {
      sodiumSegments.push({
        label: item.name,
        valuePerItem: sodium,
        itemCount: count,
        color,
      });
    }
  }

  const bars = [
    { label: "Fluid (ml)", target: TARGET_FLUID, segments: fluidSegments },
    { label: "Carbs (g)", target: TARGET_CARBS, segments: carbSegments },
    { label: "Sodium (mg)", target: TARGET_SODIUM, segments: sodiumSegments },
  ];

  return (
    <>
      <div class="space-y-2 mb-8">
        {allItems.map((item) => (
          <div key={item.name} class="border-b pb-2">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-semibold">{item.brand} {item.name}</div>
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
              <div class="flex items-center space-x-1">
                <button
                  type="button"
                  class="border rounded px-2"
                  onClick={() => remove(item.name)}
                >
                  -
                </button>
                <span>{selection[item.name] || 0}</span>
                <button
                  type="button"
                  class="border rounded px-2"
                  onClick={() => add(item.name)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <StackedBarChart bars={bars} />
    </>
  );
}
