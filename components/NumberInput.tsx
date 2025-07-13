import { JSX } from "preact/jsx-runtime";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
};

export function NumberInputWithUnit({
  value,
  unit,
  onChange,
  min,
  max,
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
    <div className="relative w-24">
      <input
        type="text"
        value={value}
        min={min}
        max={max}
        onInput={handleInput}
        className={`w-full ${
          unit ? "pr-8" : ""
        } text-right px-2 py-1 border-2 border-gray-400 rounded bg-transparent hover:bg-white/10 transition-colors font-mono`}
      />
      {unit && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
          {unit}
        </span>
      )}
    </div>
  );
}
