"use client";

import type { BreadcrumbItem, DropdownMenuItem } from "@/types/fileTree";
import { EditorHeader } from "@/components/workspace/editor/editor-header";
import { EditorBody } from "@/components/workspace/editor/editor-body";
import { useEditorStore } from "@/store/editorStore";
import { useSidebarLayout } from "@/components/workspace/layout/SidebarLayout";

interface DocumentEditorProps {
  breadcrumbPaths: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
  onMenuAction: (action: string) => void;
  menuActions: DropdownMenuItem[];
}

export function DocumentEditor({ breadcrumbPaths, onBreadcrumbClick, onMenuAction, menuActions }: DocumentEditorProps) {
  const isSaved = useEditorStore((s) => s.isSaved);
  const { collapsed } = useSidebarLayout();

  return (
    <div className="flex flex-col h-full bg-mint-bg">
      {!collapsed && (
        <EditorHeader
          breadcrumbPaths={breadcrumbPaths}
          onBreadcrumbClick={onBreadcrumbClick}
          isSaved={isSaved}
          menuActions={menuActions}
          onMenuAction={onMenuAction}
        />
      )}
      <EditorBody />
    </div>
  );
}
