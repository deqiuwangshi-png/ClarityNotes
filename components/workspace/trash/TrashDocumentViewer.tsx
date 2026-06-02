"use client";

import { EditorBody } from "@/components/workspace/editor/editor-body";
import type { TrashItemData } from "@/types/fileTree";

interface TrashDocumentViewerProps {
  item: TrashItemData;
  onBack: () => void;
  onRestore: (id: string) => void;
  onDeletePermanently: (id: string) => void;
}

export function TrashDocumentViewer({
  item,
  onBack,
  onRestore,
  onDeletePermanently,
}: TrashDocumentViewerProps) {
  return (
    <div className="flex flex-col h-full bg-mint-bg">
      <header className="z-10 flex h-14 shrink-0 items-center justify-between border-b border-mint-border/20 bg-mint-bg px-6">
        <button
          className="flex items-center gap-1.5 text-sm font-medium text-mint-muted transition hover:text-mint-accent cursor-pointer"
          type="button"
          onClick={onBack}
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>返回回收站</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 rounded-lg border border-mint-border/50 px-3 py-1.5 text-xs font-medium text-mint-accent transition hover:bg-mint-hover/70 cursor-pointer"
            type="button"
            onClick={() => onRestore(item.id)}
          >
            <span className="material-symbols-outlined text-[14px]">restore</span>
            <span>恢复</span>
          </button>
          <button
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 cursor-pointer"
            type="button"
            onClick={() => {
              onDeletePermanently(item.id);
              onBack();
            }}
          >
            <span className="material-symbols-outlined text-[14px]">delete_forever</span>
            <span>永久删除</span>
          </button>
        </div>
      </header>

      <EditorBody
        readOnly
        externalTitle={item.name}
        externalContent={item.content}
      />
    </div>
  );
}
