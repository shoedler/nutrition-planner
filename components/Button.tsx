import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact";

type Props = JSX.HTMLAttributes<HTMLButtonElement> & {
  variant?: "normal" | "danger";
};

export function Button({ variant = "normal", ...props }: Props) {
  const baseClasses =
    "px-3 py-1 border rounded-full transition-colors font-heading";
  const variantClasses = variant === "danger"
    ? "border-red-500 text-red-500 hover:bg-red-500/10"
    : "border-gray-200 text-gray-200 hover:border-blue-500";

  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`${baseClasses} ${variantClasses} ${props.class ?? ""}`}
    />
  );
}
