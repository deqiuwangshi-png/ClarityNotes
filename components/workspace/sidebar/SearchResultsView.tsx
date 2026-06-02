"use client";

import type { SearchResultItem } from "@/types/fileTree";

interface SearchResultsViewProps {
  results: SearchResultItem[];
  query: string;
  recentSearches: string[];
  onSelect: (nodeId: string) => void;
  onSearchRecent: (term: string) => void;
  onRemoveRecent: (term: string) => void;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="rounded bg-mint-hover px-0.5 text-mint-text">{part}</mark>
      : part
  );
}

export function SearchResultsView({
  results,
  query,
  recentSearches,
  onSelect,
  onSearchRecent,
  onRemoveRecent,
}: SearchResultsViewProps) {
  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="px-4 py-2.5">
        {recentSearches.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-mint-muted/60">最近搜索</span>
            {recentSearches.map((term) => (
              <span
                key={term}
                className="inline-flex items-center gap-1 rounded-md border border-mint-border/20 bg-white px-2 py-0.5 text-[11px] text-mint-muted"
              >
                <button
                  className="max-w-[100px] truncate hover:text-mint-accent cursor-pointer"
                  type="button"
                  onClick={() => onSearchRecent(term)}
                >
                  {term}
                </button>
                <button
                  className="flex size-3.5 items-center justify-center rounded-full text-mint-muted/40 hover:text-mint-muted cursor-pointer"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(term);
                  }}
                  aria-label={`移除 ${term}`}
                >
                  <span className="material-symbols-outlined text-[10px]">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-mint-muted">
          <span className="material-symbols-outlined text-[36px]">search_off</span>
          <p className="text-xs">未找到相关文档</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {results.map((item) => (
            <button
              key={item.nodeId}
              className="flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-mint-hover/50 cursor-pointer"
              type="button"
              onClick={() => onSelect(item.nodeId)}
            >
              <span className="text-[13px] font-medium text-mint-text">
                {highlightMatch(item.title, query)}
              </span>
              {item.path.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] text-mint-muted">
                  {item.path.map((p, i) => (
                    <span key={p.id} className="flex items-center gap-1">
                      {i > 0 && <span className="text-[10px]">›</span>}
                      {p.name}
                    </span>
                  ))}
                </span>
              )}
              {item.snippet && (
                <span className="text-[11px] leading-relaxed text-mint-muted/80 line-clamp-2">
                  {highlightMatch(item.snippet, query)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
