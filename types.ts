export type NutritionFactsPerServing = {
  kilocalories: number;

  fatGrams?: number;
  saturatedFatGrams?: number;

  carbohydratesGrams?: number;
  sugarsGrams?: number;

  fiberGrams?: number;
  proteinGrams?: number;

  saltGrams?: number;

  caffeineMilligrams?: number;

  // Electrolytes
  chlorideMilligrams?: number;
  potassiumMilligrams?: number;
  sodiumMilligrams?: number;
  calciumMilligrams?: number;
  magnesiumMilligrams?: number;
};

export type Nutrition = {
  brand: string;
  name: string;
  nutritionFactsPerServing: NutritionFactsPerServing;

  flavor?: string;

  metaColor: `#${string}`; // Hex color code
};

export type DrinkMix = Nutrition & {
  equatesToMilliliters: number;
  servingSizeGrams: number;
};

export type Drink = Nutrition & {
  servingSizeMilliliters: number;
};

export type Gel = Nutrition & {
  servingSizeGrams: number;
  glucoseToFructoseRatio: number;
};

export type Capsule = Nutrition & {
  servingSizeUnits: number;
};

export type NutritionItem = DrinkMix | Drink | Gel | Capsule;

const SODIUM_IN_SALT_RATIO = 0.393;

export const NutritionUtils = {
  getCarbsGrams: (item: NutritionItem): number => {
    const carbsKey: keyof NutritionFactsPerServing = "carbohydratesGrams"; // Type safety

    if (carbsKey in item.nutritionFactsPerServing) {
      return item.nutritionFactsPerServing.carbohydratesGrams || 0;
    }
    return 0;
  },
  getSodiumMilligrams: (item: NutritionItem): number => {
    const sodiumKey: keyof NutritionFactsPerServing = "sodiumMilligrams"; // Type safety
    const saltKey: keyof NutritionFactsPerServing = "saltGrams"; // Type safety

    if (sodiumKey in item.nutritionFactsPerServing) {
      return item.nutritionFactsPerServing.sodiumMilligrams || 0;
    }
    if (saltKey in item.nutritionFactsPerServing) {
      return item.nutritionFactsPerServing.saltGrams
        ? item.nutritionFactsPerServing.saltGrams * 1000 * SODIUM_IN_SALT_RATIO
        : 0;
    }
    return 0;
  },
  getFluidVolumeMilliliters: (item: NutritionItem): number => {
    const drinkMixKey: keyof DrinkMix = "equatesToMilliliters"; // Type safety
    const drinkKey: keyof Drink = "servingSizeMilliliters"; // Type safety

    if (drinkMixKey in item) {
      return (item as DrinkMix).equatesToMilliliters;
    }
    if (drinkKey in item) {
      return (item as Drink).servingSizeMilliliters;
    }
    return 0;
  },
  getServingSizeString: (item: NutritionItem): string => {
    const drinkMixKey: keyof DrinkMix = "servingSizeGrams"; // Type safety
    const drinkKey: keyof Drink = "servingSizeMilliliters"; // Type safety
    const capsKey: keyof Capsule = "servingSizeUnits"; // Type safety

    if (drinkMixKey in item) {
      return `${(item as DrinkMix).servingSizeGrams}g`;
    }
    if (drinkKey in item) {
      return `${(item as Drink).servingSizeMilliliters}ml`;
    }
    if (capsKey in item) {
      return `${(item as Capsule).servingSizeUnits} capsule` +
        ((item as Capsule).servingSizeUnits > 1 ? "s" : "");
    }
    return "N/A";
  },
  getItemKey: (item: NutritionItem): string =>
    [item.brand, item.name, item.flavor || ""].map((part) =>
      part.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()
    ).join("-"),
} as const;
