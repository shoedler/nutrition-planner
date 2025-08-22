import { useComputed, useSignal } from "@preact/signals";
import StackedBarChart, {
  BarData,
  BarSegment,
} from "../components/StackedBarChart.tsx";

import capsules from "../static/data/caps.json" with { type: "json" };
import drinkMixes from "../static/data/drink-mixes.json" with { type: "json" };
import drinks from "../static/data/drinks.json" with { type: "json" };
import gels from "../static/data/gels.json" with { type: "json" };

import { HeadingLarge } from "../components/HeadingLarge.tsx";
import { ItemSelectionList } from "../components/ItemSelectionList.tsx";
import { TargetSliders } from "../components/TargetSliders.tsx";
import { Title } from "../components/Title.tsx";
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

export default function NutritionPlanner() {
  const selection = useSignal<{ [key: string]: number }>({});

  const carbsPerHour = useSignal(100);
  const sodiumPerLiter = useSignal(1500);
  const fluidPerHour = useSignal(800);
  const durationMinutes = useSignal(360);

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

  const fluidBar: BarData = {
    label: "fluid",
    unit: "ml",
    target: targetFluid.value,
    segments: [],
  };
  const carbsBar: BarData = {
    label: "carbs",
    unit: "g",
    target: targetCarbs.value,
    segments: [],
  };
  const sodiumBar: BarData = {
    label: "sodium",
    unit: "mg",
    target: targetSodium.value,
    segments: [],
  };

  allItems.forEach((item) => {
    const key = NutritionUtils.getItemKey(item);
    const count = selection.value[key] || 0;
    if (!count) return;

    const color = item.metaColor;
    const label = `${item.brand} ${item.name} ${item.flavor || ""}`.trim();

    [
      [fluidBar.segments, NutritionUtils.getFluidVolumeMilliliters(item)],
      [carbsBar.segments, NutritionUtils.getCarbsGrams(item)],
      [sodiumBar.segments, NutritionUtils.getSodiumMilligrams(item)],
    ]
      .filter(([, value]) => value as number > 0) // Type-forcing, bc Deno doesn't support type narrowing in destructuring
      .forEach(([segments, valuePerItem]) => {
        (segments as BarSegment[]).push({ // Type-forcing, bc Deno doesn't support type narrowing in destructuring
          label,
          valuePerItem: (valuePerItem as number), // Type-forcing, bc Deno doesn't support type narrowing in destructuring
          itemCount: count,
          color,
        });
      });
  });

  const bars: BarData[] = [fluidBar, carbsBar, sodiumBar];

  const usableWindowHeightThird = useComputed(() => {
    const height = globalThis.innerHeight - 100; // Adjust for header and padding
    return Math.max(height / 3, 300); // Minimum height of 300px
  });

  return (
    <div class="flex flex-col items-center min-w-[900px] max-w-[1200px] m-auto gap-10">
      <Title />
      <TargetSliders
        carbsPerHour={carbsPerHour}
        sodiumPerLiter={sodiumPerLiter}
        fluidPerHour={fluidPerHour}
        durationMinutes={durationMinutes}
      />
      <ItemSelectionList
        allItems={allItems}
        selection={selection}
        heightPx={usableWindowHeightThird.value}
      />
      <HeadingLarge>targets</HeadingLarge>
      <StackedBarChart bars={bars} />
    </div>
  );
}
