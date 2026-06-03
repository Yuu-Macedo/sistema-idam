import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Pesquisar...",
  label = "Pesquisa",
}: SearchInputProps) {
  return (
    <label className="relative block" aria-label={label}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#607368]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="idam-field w-full pl-10 pr-4 text-sm"
      />
    </label>
  );
}
