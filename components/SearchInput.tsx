import { Signal } from "@preact/signals";

type Props = {
  search: Signal<string>;
  placeholder?: string;
};

export function SearchInput({ search, placeholder = "search" }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={search.value}
      onInput={(e) => search.value = (e.target as HTMLInputElement).value}
      class="w-full text-2xl text-center pb-2 italic font-heading outline-none border-b border-gray-300 focus:border-blue-500 bg-transparent"
    />
  );
}
