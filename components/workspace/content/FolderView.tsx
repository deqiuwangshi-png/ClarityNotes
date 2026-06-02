"use client";

import type { BreadcrumbItem, FolderItem } from "@/types/workspace";
import { useSidebarLayout } from "@/components/workspace/layout/SidebarLayout";
import { Breadcrumb } from "@/components/workspace/common/Breadcrumb";
import { FolderListHeader } from "@/components/workspace/folder/folder-list-header";
import { FolderListItem } from "@/components/workspace/folder/folder-list-item";

interface FolderViewProps {
  folderName: string;
  breadcrumbPaths: BreadcrumbItem[];
  items: FolderItem[];
  onBreadcrumbClick: (id: string) => void;
  onItemClick: (itemId: string) => void;
}

export function FolderView({ folderName, breadcrumbPaths, items, onBreadcrumbClick, onItemClick }: FolderViewProps) {
  const { collapsed } = useSidebarLayout();

  return (
    <div className="relative grow overflow-y-auto scroll-smooth bg-mint-bg" style={{ scrollbarGutter: "stable" }}>
      {!collapsed && (
        <div className="px-6 pt-6">
          <Breadcrumb paths={breadcrumbPaths} onNavigate={onBreadcrumbClick} />
        </div>
      )}
      <div className="relative mx-auto mb-16 max-w-[960px] px-6 pb-12 md:px-10 md:pt-8">
        <header className="mb-6 mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-mint-text">{folderName}</h1>
        </header>
        <FolderListHeader />
        <div className="space-y-1">
          {items.map((item) => (
            <FolderListItem key={item.id} item={item} onClick={onItemClick} />
          ))}
        </div>
      </div>
    </div>
  );
}
