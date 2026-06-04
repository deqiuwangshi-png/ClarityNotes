"use client";

import { useSearchStore } from "@/store/searchStore";

interface SearchBarProps {
  onClear?: () => void;
  onQueryChange?: (value: string) => void;
}

export function SearchBar({ onClear, onQueryChange }: SearchBarProps) {
  const query = useSearchStore((s) => s.query);
  const clearSearch = useSearchStore((s) => s.clearSearch);

  const handleChange = (value: string) => {
    if (!value.trim()) {
      clearSearch();
      onClear?.();
      return;
    }
    onQueryChange?.(value);
  };

  const handleClear = () => {
    clearSearch();
    onClear?.();
  };

  return (
    <div className="relative my-4">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-mint-muted">
        search
      </span>
      <input
        className="w-full rounded-xl border border-mint-border/30 bg-white py-2 pl-9 pr-3 text-[13px] text-mint-text outline-none transition placeholder:text-mint-muted/60 focus:border-mint-accent focus:ring-1 focus:ring-mint-accent"
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="搜索..."
      />
      {query && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full text-mint-muted hover:text-mint-accent cursor-pointer"
          type="button"
          onClick={handleClear}
          aria-label="清除搜索"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      )}
    </div>
  );
}
