import { JSX } from "preact";

export type Props = {
  value: number;
  unit?: string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

export default function LargeNumberInput({
  value,
  unit,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  label,
}: Props) {
  const handleInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const raw = e.currentTarget.value;

    const parsed = Number(raw);
    if (isNaN(parsed) || raw === "") {
      onChange(0);
      return;
    }
    if (parsed > max) {
      onChange(max);
      return;
    }
    if (parsed < min) {
      onChange(min);
      return;
    }

    onChange(parsed);
  };

  return (
    <label class="flex flex-col items-center gap-1">
      {label && <div class="text-sm text-center">{label}</div>}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onInput={handleInput}
        class="text-6xl text-center font-heading w-full max-w-48 outline-none border-b border-gray-300 focus:border-blue-500 bg-transparent"
      />
      {unit && <div class="text-sm text-center text-gray-400">{unit}</div>}
    </label>
  );
}
