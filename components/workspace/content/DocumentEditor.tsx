"use client";

import type { BreadcrumbItem, DropdownMenuItem } from "@/types/workspace";
import { useTextSelection } from "@/hooks/use-text-selection";
import { EditorHeader } from "@/components/workspace/editor/editor-header";
import { EditorBody } from "@/components/workspace/editor/editor-body";
import { BubbleMenu } from "@/components/workspace/content/BubbleMenu";
import { useEditorStore } from "@/store/editorStore";

interface DocumentEditorProps {
  breadcrumbPaths: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
  onMenuAction: (action: string) => void;
  menuActions: DropdownMenuItem[];
}

export function DocumentEditor({ breadcrumbPaths, onBreadcrumbClick, onMenuAction, menuActions }: DocumentEditorProps) {
  const textSelection = useTextSelection();
  const isSaved = useEditorStore((s) => s.isSaved);

  return (
    <div className="flex flex-col h-full bg-mint-bg">
      <EditorHeader
        breadcrumbPaths={breadcrumbPaths}
        onBreadcrumbClick={onBreadcrumbClick}
        isSaved={isSaved}
        menuActions={menuActions}
        onMenuAction={onMenuAction}
      />
      <EditorBody />
      <BubbleMenu visible={textSelection.visible} position={textSelection.position} above={textSelection.above} />
    </div>
  );
}
