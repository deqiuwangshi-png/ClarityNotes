"use client";

import type { FolderItem } from "@/types/workspace";
import { FolderListHeader } from "@/components/workspace/folder/folder-list-header";
import { FolderListItem } from "@/components/workspace/folder/folder-list-item";

interface FolderViewProps {
  folderName: string;
  breadcrumbPaths: { id: string; name: string }[];
  items: FolderItem[];
  onBreadcrumbClick: (id: string) => void;
  onItemClick: (itemId: string) => void;
  onItemMore: (itemId: string) => void;
}

export function FolderView({ folderName, breadcrumbPaths, items, onBreadcrumbClick, onItemClick, onItemMore }: FolderViewProps) {
  return (
    <div className="relative grow overflow-y-auto scroll-smooth bg-mint-bg" style={{ scrollbarGutter: "stable" }}>
      <div className="relative mx-auto mb-16 mt-6 max-w-[960px] px-6 pb-12 pt-6 md:px-10 md:pt-8">
        <nav className="mb-6 flex items-center gap-1 text-sm text-[#6B7280]">
          {breadcrumbPaths.map((item) => (
            <span key={item.id} className="flex items-center gap-1">
              <button className="rounded px-1 py-0.5 transition hover:bg-mint-hover/70 hover:text-mint-accent-light" type="button" onClick={() => onBreadcrumbClick(item.id)}>
                {item.name}
              </button>
            </span>
          ))}
        </nav>
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-mint-text">{folderName}</h1>
        </header>
        <FolderListHeader />
        <div className="space-y-1">
          {items.map((item) => (
            <FolderListItem key={item.id} item={item} onClick={onItemClick} onMore={onItemMore} />
          ))}
        </div>
      </div>
    </div>
  );
}
