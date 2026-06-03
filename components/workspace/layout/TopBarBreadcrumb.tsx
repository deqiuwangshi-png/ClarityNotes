"use client";

import { useCallback } from "react";
import { useFileTreeStore } from "@/store/fileTreeStore";
import { useBreadcrumb } from "@/hooks/use-file-tree";
import type { BreadcrumbItem } from "@/types/fileTree";

function BreadcrumbItemView({ item, onNavigate }: { item: BreadcrumbItem; onNavigate: (id: string) => void }) {
  if (item.isLast) {
    return <span className="truncate font-semibold text-[#121c2a]">{item.name}</span>
  }
  return (
    <>
      <button className="truncate transition hover:text-mint-accent" type="button" onClick={() => onNavigate(item.id)}>
        {item.name}
      </button>
      <span className="text-[14px]" aria-hidden="true">›</span>
    </>
  )
}

export function TopBarBreadcrumb() {
  const breadcrumb = useBreadcrumb();
  const selectNode = useFileTreeStore((s) => s.selectNode);

  const handleNavigate = useCallback(
    (id: string) => selectNode(id),
    [selectNode],
  );

  const displayPaths: BreadcrumbItem[] =
    breadcrumb.length > 0
      ? breadcrumb
      : [{ id: "root", name: "我的文档", isLast: true }];

  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-[13px] text-mint-muted">
      {displayPaths.map((item) => (
        <span key={item.id} className="flex min-w-0 items-center gap-1.5">
          <BreadcrumbItemView item={item} onNavigate={handleNavigate} />
        </span>
      ))}
    </nav>
  );
}
