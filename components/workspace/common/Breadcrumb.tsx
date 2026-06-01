"use client";

import type { BreadcrumbItem } from "@/types/workspace";

interface BreadcrumbProps {
  paths: BreadcrumbItem[];
  onNavigate: (id: string) => void;
}

export function Breadcrumb({ paths, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-[13px] text-mint-muted">
      {paths.map((item) => (
        <span key={item.id} className="flex min-w-0 items-center gap-1.5">
          {item.isLast ? (
            <span className="truncate font-semibold text-[#121c2a]">{item.name}</span>
          ) : (
            <>
              <button className="truncate transition hover:text-mint-accent" type="button" onClick={() => onNavigate(item.id)}>
                {item.name}
              </button>
              <span className="text-[14px]" aria-hidden="true">›</span>
            </>
          )}
        </span>
      ))}
    </nav>
  );
}
