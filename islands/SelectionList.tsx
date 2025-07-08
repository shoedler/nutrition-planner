import { useComputed, useSignal } from "@preact/signals";
import StackedBarChart, {
  BAR_COLORS,
  BarData,
} from "../components/StackedBarChart.tsx";

import capsules from "../static/data/caps.json" with { type: "json" };
import drinkMixes from "../static/data/drink-mixes.json" with { type: "json" };
import drinks from "../static/data/drinks.json" with { type: "json" };
import gels from "../static/data/gels.json" with { type: "json" };

import { ItemSelectionList } from "../components/ItemSelectionList.tsx";
import { TargetSliders } from "../components/TargetSliders.tsx";
import {
  Capsule,
  Drink,
  DrinkMix,
  Gel,
  NutritionItem,
  NutritionUtils,
} from "../types.ts";

const allItems: NutritionItem[] = [
  ...(drinkMixes as DrinkMix[]).map((x) => ({ ...x, type: "drinkMix" })),
  ...(drinks as Drink[]).map((x) => ({ ...x, type: "drink" })),
  ...(gels as Gel[]).map((x) => ({ ...x, type: "gel" })),
  ...(capsules as Capsule[]).map((x) => ({ ...x, type: "capsule" })),
];

export default function SelectionList() {
  const selection = useSignal<{ [key: string]: number }>({});

  const carbsPerHour = useSignal(70);
  const sodiumPerLiter = useSignal(1500);
  const fluidPerHour = useSignal(600);
  const durationMinutes = useSignal(480);

  const durationHours = useComputed(() => durationMinutes.value / 60);
  const targetCarbs = useComputed(() =>
    carbsPerHour.value * durationHours.value
  );
  const targetFluid = useComputed(() =>
    fluidPerHour.value * durationHours.value
  );
  const targetSodium = useComputed(
    () => (targetFluid.value / 1000) * sodiumPerLiter.value,
  );

  const itemColorMap = new Map<string, string>();
  let colorIndex = 0;
  function getColor(itemName: string) {
    if (!itemColorMap.has(itemName)) {
      itemColorMap.set(itemName, BAR_COLORS[colorIndex % BAR_COLORS.length]);
      colorIndex++;
    }
    return itemColorMap.get(itemName)!;
  }

  const fluidBar: BarData = {
    label: "Fluid",
    unit: "ml",
    target: targetFluid.value,
    segments: [],
  };
  const carbsBar: BarData = {
    label: "Carbs",
    unit: "g",
    target: targetCarbs.value,
    segments: [],
  };
  const sodiumBar: BarData = {
    label: "Sodium",
    unit: "mg",
    target: targetSodium.value,
    segments: [],
  };

  allItems.forEach((item) => {
    const count = selection.value[item.name] || 0;
    if (!count) return;

    const color = getColor(item.name);
    const label = `${item.brand} ${item.name}`;

    [
      [fluidBar.segments, NutritionUtils.getFluidVolumeMilliliters(item)],
      [carbsBar.segments, NutritionUtils.getCarbsGrams(item)],
      [sodiumBar.segments, NutritionUtils.getSodiumMilligrams(item)],
    ]
      .filter(([, value]) => value > 0)
      .forEach(([segments, valuePerItem]) => {
        segments.push({
          label,
          valuePerItem,
          itemCount: count,
          color,
        });
      });
  });

  const bars: BarData[] = [fluidBar, carbsBar, sodiumBar];

  return (
    <>
      <TargetSliders
        carbsPerHour={carbsPerHour}
        sodiumPerLiter={sodiumPerLiter}
        fluidPerHour={fluidPerHour}
        durationMinutes={durationMinutes}
      />
      <ItemSelectionList allItems={allItems} selection={selection} />
      <StackedBarChart bars={bars} />
    </>
  );
}
