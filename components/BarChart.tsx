export default function CustomBarChart(
  { fluid, carbs, sodium, targets }: {
    fluid: number;
    carbs: number;
    sodium: number;
    targets: { fluid: number; carbs: number; sodium: number };
  },
) {
  const data = [
    { label: "Fluid (ml)", value: fluid, target: targets.fluid },
    { label: "Carbs (g)", value: carbs, target: targets.carbs },
    { label: "Sodium (mg)", value: sodium, target: targets.sodium },
  ];

  // Find max for scaling bars
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.value, d.target)),
  );

  return (
    <div class="space-y-4">
      {data.map((d) => (
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">{d.label}</span>
            <span class="text-sm text-gray-500">
              {d.value} ({diffString(d.value, d.target)} vs {d.target})
            </span>
          </div>
          <div class="relative h-6 bg-gray-100 rounded">
            <div
              class="absolute h-6 bg-blue-500 rounded"
              style={{
                width: `${(d.value / maxVal) * 100}%`,
              }}
            />
            <div
              class="absolute h-6 border-l-2 border-black"
              style={{
                left: `${(d.target / maxVal) * 100}%`,
                top: 0,
                bottom: 0,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function diffString(value: number, target: number) {
  const diff = Math.round(value - target);
  return diff >= 0 ? `+${diff}` : `${diff}`;
}
