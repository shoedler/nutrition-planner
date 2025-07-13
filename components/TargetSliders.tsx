import { Signal, useComputed } from "@preact/signals";
import LargeNumberInput from "./LargeNumberInput.tsx";

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
  const carbsProps = {
    label: "carbs",
    value: carbsPerHour.value,
    unit: "g/h",
    onChange: (value: number) => carbsPerHour.value = value,
    min: 0,
    max: 120,
  };
  const fluidProps = {
    label: "fluid",
    value: fluidPerHour.value,
    unit: "ml/h",
    onChange: (value: number) => fluidPerHour.value = value,
    min: 0,
    max: 2000,
  };
  const sodiumProps = {
    label: "sodium",
    value: sodiumPerLiter.value,
    unit: "mg/l",
    onChange: (value: number) => sodiumPerLiter.value = value,
    min: 0,
    max: 2000,
  };

  return (
    <div class="w-full flex flex-row justify-around gap-2">
      <LargeNumberInput {...carbsProps} />
      <LargeNumberInput {...fluidProps} />
      <LargeNumberInput {...sodiumProps} />
      <DurationInput signal={durationMinutes} />
    </div>
  );
}

function DurationInput({ signal }: { signal: Signal<number> }) {
  const hours = useComputed(() => Math.floor(signal.value / 60));
  const minutes = useComputed(() => signal.value % 60);

  return (
    <div class="flex items-center space-x-2">
      <LargeNumberInput
        label="duration"
        min={0}
        max={10000}
        value={signal.value}
        onChange={(newVal) =>
          signal.value = Math.max(
            0,
            newVal,
          )}
        unit="min"
      />
      <span class="text-gray-400 text-sm">
        {`→ ${hours.value} h ${minutes.value} min`}
      </span>
    </div>
  );
}
