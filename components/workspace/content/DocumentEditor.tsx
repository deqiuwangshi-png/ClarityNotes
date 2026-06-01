"use client";

import type { BreadcrumbItem, DocumentInfo, DropdownMenuItem } from "@/types/workspace";
import { useTextSelection } from "@/hooks/use-text-selection";
import { EditorHeader } from "@/components/workspace/editor/editor-header";
import { EditorBody } from "@/components/workspace/editor/editor-body";
import { BubbleMenu } from "@/components/workspace/content/BubbleMenu";
import { useEditorStore } from "@/store/editorStore";

interface DocumentEditorProps {
  document: DocumentInfo;
  breadcrumbPaths: BreadcrumbItem[];
  onBreadcrumbClick: (id: string) => void;
  onMenuAction: (action: string) => void;
  menuActions: DropdownMenuItem[];
}

export function DocumentEditor({ document: doc, breadcrumbPaths, onBreadcrumbClick, onMenuAction, menuActions }: DocumentEditorProps) {
  const textSelection = useTextSelection();
  const isSaved = useEditorStore((s) => s.isSaved);

  return (
    <div className="flex flex-col h-full">
      <EditorHeader
        breadcrumbPaths={breadcrumbPaths}
        onBreadcrumbClick={onBreadcrumbClick}
        isSaved={isSaved}
        menuActions={menuActions}
        onMenuAction={onMenuAction}
      />
      <EditorBody
        createdAt={doc.createdAt}
        lastModified={doc.lastModified}
      />
      <BubbleMenu visible={textSelection.visible} position={textSelection.position} above={textSelection.above} />
    </div>
  );
}
