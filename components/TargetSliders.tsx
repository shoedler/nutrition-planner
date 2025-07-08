import { Signal, useComputed } from "@preact/signals";

type Props = {
  carbsPerHour: Signal<number>;
  sodiumPerLiter: Signal<number>;
  fluidPerHour: Signal<number>;
  durationMinutes: Signal<number>;
};

export function TargetSliders({
  carbsPerHour,
  sodiumPerLiter,
  fluidPerHour,
  durationMinutes,
}: Props) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Slider label="Carbs (g/h)" signal={carbsPerHour} min={0} max={120} />
      <Slider
        label="Sodium (mg/L)"
        signal={sodiumPerLiter}
        min={0}
        max={2000}
      />
      <Slider label="Fluid (ml/h)" signal={fluidPerHour} min={0} max={2000} />
      <DurationInput signal={durationMinutes} />
    </div>
  );
}

function Slider({
  label,
  signal,
  min,
  max,
}: {
  label: string;
  signal: Signal<number>;
  min: number;
  max: number;
}) {
  function setValue(val: number) {
    const clamped = Math.max(min, Math.min(max, val));
    signal.value = clamped;
  }

  return (
    <label class="flex flex-col text-gray-300 space-y-1">
      <span class="font-semibold">{label}</span>
      <div class="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          value={signal.value}
          onInput={(e) =>
            setValue(Number((e.target as HTMLInputElement).value))}
          class="w-full accent-gray-400"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={signal.value}
          onInput={(e) =>
            setValue(Number((e.target as HTMLInputElement).value))}
          class="w-20 text-right px-2 py-1 border-2 rounded bg-transparent hover:bg-white/10 transition-colors font-mono"
        />
      </div>
    </label>
  );
}

function DurationInput({ signal }: { signal: Signal<number> }) {
  const hours = useComputed(() => Math.floor(signal.value / 60));
  const minutes = useComputed(() => signal.value % 60);

  return (
    <label class="flex flex-col text-gray-300 space-y-1">
      <span class="font-semibold">Excercise Duration (minutes)</span>
      <div class="flex items-center space-x-2">
        <input
          type="number"
          min={0}
          max={10000}
          value={signal.value}
          onInput={(e) =>
            signal.value = Math.max(
              0,
              Number((e.target as HTMLInputElement).value),
            )}
          class="w-24 text-right px-2 py-1 border-2 rounded bg-transparent hover:bg-white/10 transition-colors font-mono"
        />
        <span class="text-gray-400 text-sm">
          {`→ ${hours.value} h ${minutes.value} min`}
        </span>
      </div>
    </label>
  );
}
