import { Signal, useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { NumberInputWithUnit } from "../components/NumberInput.tsx";
import { NutritionItem, NutritionUtils } from "../types.ts";
import { HeadingMedium } from "./HeadingMedium.tsx";
import { SearchInput } from "./SearchInput.tsx";

type Props = {
  allItems: NutritionItem[];
  selection: Signal<{ [key: string]: number }>;
  heightPx?: number;
};

export function ItemSelectionList(
  { allItems, selection, heightPx = 300 }: Props,
) {
  const search = useSignal("");

  function setItemCount(name: string, count: number) {
    if (count < 0) return;
    selection.value = { ...selection.value, [name]: count };
  }

  const filtered = () => {
    const query = search.value.trim().toLowerCase().replace(/\s+/g, "");
    if (!query) return allItems;
    if (query === "$used") {
      return allItems.filter((item) =>
        (selection.value[NutritionUtils.getItemKey(item)] || 0) > 0
      );
    }
    return allItems.filter((item) => {
      const haystack = (item.brand + item.name).toLowerCase().replace(
        /\s+/g,
        "",
      );
      return haystack.includes(query);
    });
  };

  const grouped = () => {
    const result = new Map<string, NutritionItem[]>();
    for (const item of filtered()) {
      if (!result.has(item.brand)) result.set(item.brand, []);
      result.get(item.brand)!.push(item);
    }
    return result;
  };

  return (
    <div class="w-full flex flex-col items-center">
      <div class="w-full flex items-center mb-5 space-x-4 justify-between">
        <SearchInput search={search} placeholder="search (try $used)" />
        <div class="min-w-max flex items-center space-x-2">
          <Button onClick={() => (search.value = "$used")}>$used</Button>
          <Button onClick={() => selection.value = {}} variant="danger">
            clear used
          </Button>
        </div>
      </div>
      <div
        class="w-full overflow-y-auto p-3 clean-scrollbar bg-white/1 backdrop-blur-[2.5px] scroll-smooth shadow-[inset_0_0_10px_rgba(10,10,10,0.2)]"
        style={{
          maxHeight: `${heightPx}px`,
          minHeight: `${heightPx}px`,
        }}
      >
        {filtered().length === 0 && (
          <div class="italic text-gray-400 px-1 py-2">
            No items match your search.
          </div>
        )}

        {[...grouped().entries()].map(([brand, items]) => (
          <BrandSection
            key={brand}
            brand={brand}
            items={items}
            selection={selection}
            setItemCount={setItemCount}
          />
        ))}
      </div>
    </div>
  );
}

function BrandSection(
  { brand, items, selection, setItemCount }: {
    brand: string;
    items: NutritionItem[];
    selection: Signal<{ [key: string]: number }>;
    setItemCount: (name: string, count: number) => void;
  },
) {
  return (
    <div>
      <HeadingMedium>{brand}</HeadingMedium>
      {items.map((item) => {
        const key = NutritionUtils.getItemKey(item);

        return (
          <ItemRow
            key={key}
            item={item}
            count={selection.value[key] || 0}
            onChange={(newCount) => setItemCount(key, newCount)}
          />
        );
      })}
    </div>
  );
}

function ItemRow(
  { item, count, onChange }: {
    item: NutritionItem;
    count: number;
    onChange: (newCount: number) => void;
  },
) {
  return (
    <div class="pl-3 py-1 flex items-center justify-between">
      <div class="flex-1 mr-2">
        <div class="text-sm font-body text-gray-200 inline-block mr-2">
          {item.name} {item.flavor && " — " + item.flavor}
        </div>
        <span class="text-sm text-gray-400">
          {NutritionUtils.getServingSizeString(item)} —{" "}
          {item.nutritionFactsPerServing.carbohydratesGrams}g carbs —{" "}
          {NutritionUtils.getSodiumMilligrams(item)} mg sodium
          {"equatesToMilliliters" in item
            ? ` — ${item.equatesToMilliliters} ml fluid`
            : ""}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <Button onClick={() => onChange(count - 1)}>-</Button>
        <NumberInputWithUnit
          value={count}
          onChange={(val) => onChange(val)}
          min={0}
          max={100}
        />
        <Button onClick={() => onChange(count + 1)}>+</Button>
      </div>
    </div>
  );
}
