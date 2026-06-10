"use client";

import type { BreadcrumbItem, DropdownMenuItem } from "@/types/fileTree";
import { Breadcrumb } from "@/components/workspace/common/Breadcrumb";
import { SaveStatusBadge } from "@/components/workspace/common/SaveStatusBadge";
import { TopBarDropdown } from "@/components/workspace/dropdown/top-bar-dropdown";

interface EditorHeaderProps {
  breadcrumbPaths: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
  isSaved: boolean;
  saveError?: string | null;
  menuActions: DropdownMenuItem[];
  onMenuAction: (action: string) => void;
}

export function EditorHeader({
  breadcrumbPaths,
  onBreadcrumbClick,
  isSaved,
  saveError,
  menuActions,
  onMenuAction,
}: EditorHeaderProps) {
  return (
    <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-mint-border/20 bg-mint-bg px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Breadcrumb paths={breadcrumbPaths} onNavigate={onBreadcrumbClick} />
        <SaveStatusBadge isSaved={isSaved} error={saveError} />
      </div>
      <div className="flex items-center gap-1">
        <TopBarDropdown items={menuActions} onAction={onMenuAction} />
      </div>
    </header>
  );
}
