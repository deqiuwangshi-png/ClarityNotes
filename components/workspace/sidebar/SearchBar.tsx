"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "搜索..." }: SearchBarProps) {
  return (
    <div className="relative my-4">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-mint-muted">
        search
      </span>
      <input
        className="w-full rounded-xl border border-mint-border/30 bg-white py-2 pl-9 pr-3 text-[13px] text-mint-text outline-none transition placeholder:text-mint-muted/60 focus:border-mint-accent focus:ring-1 focus:ring-mint-accent"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
