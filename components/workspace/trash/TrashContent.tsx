"use client";

import { useEffect, useRef, useState } from "react";
import { TrashHeader } from "@/components/workspace/trash/TrashHeader";
import { TrashItem } from "@/components/workspace/trash/TrashItem";
import { TrashDocumentViewer } from "@/components/workspace/trash/TrashDocumentViewer";
import { FloatingBatchBar } from "@/components/workspace/trash/FloatingBatchBar";
import { useTrashStore } from "@/store/trashStore";
import type { TrashItemData } from "@/types/fileTree";

interface TrashContentProps {
  onClose: () => void;
}

export function TrashContent({ onClose }: TrashContentProps) {
  const items = useTrashStore((s) => s.items);
  const loading = useTrashStore((s) => s.loading);
  const isBatchMode = useTrashStore((s) => s.isBatchMode);
  const selectedIds = useTrashStore((s) => s.selectedIds);
  const loadTrash = useTrashStore((s) => s.loadTrash);
  const enterBatchMode = useTrashStore((s) => s.enterBatchMode);
  const exitBatchMode = useTrashStore((s) => s.exitBatchMode);
  const toggleSelectItem = useTrashStore((s) => s.toggleSelectItem);
  const toggleSelectAll = useTrashStore((s) => s.toggleSelectAll);
  const restoreTrashItem = useTrashStore((s) => s.restoreItem);
  const deletePermanently = useTrashStore((s) => s.deletePermanently);
  const emptyTrash = useTrashStore((s) => s.emptyTrash);
  const batchRestore = useTrashStore((s) => s.batchRestore);
  const batchDelete = useTrashStore((s) => s.batchDelete);

  const [previewItem, setPreviewItem] = useState<TrashItemData | null>(null);
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadTrash();
    }
  }, [loadTrash]);

  const selectedCount = selectedIds.size;
  const isAllSelected = selectedIds.size === items.length && items.length > 0;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;

  const handleMultiSelect = (id: string) => {
    enterBatchMode(id);
  };

  const handleRestore = (id: string) => {
    setPreviewItem(null);
    restoreTrashItem(id).then(() => onClose());
  };

  const handleDeletePermanently = (id: string) => {
    setPreviewItem(null);
    deletePermanently(id);
  };

  const handleEmptyAll = () => {
    emptyTrash();
  };

  const handleBatchRestore = () => {
    batchRestore().then(() => onClose());
  };

  const handleBatchDelete = () => {
    batchDelete();
  };

  const handlePreview = (item: TrashItemData) => {
    setPreviewItem(item);
  };

  const handleBackToList = () => {
    setPreviewItem(null);
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-mint-primary border-t-transparent animate-spin" />
        <p className="text-sm text-mint-muted">加载回收站...</p>
      </div>
    );
  }

  return (
    <>
      {previewItem ? (
        <TrashDocumentViewer
          item={previewItem}
          onBack={handleBackToList}
          onRestore={handleRestore}
          onDeletePermanently={handleDeletePermanently}
        />
      ) : (
        <main className="relative flex h-screen flex-1 flex-col overflow-y-auto bg-mint-bg scroll-smooth" style={{ scrollbarGutter: "stable" }}>
          <div className="relative mx-auto mb-16 mt-12 w-full max-w-[1120px] px-6 pb-24 md:px-12">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <span className="material-symbols-outlined text-5xl text-mint-border">delete</span>
                <p className="text-sm text-mint-muted">回收站为空</p>
              </div>
            ) : (
              <>
                <TrashHeader onEmptyAll={handleEmptyAll} />

                <div className="mb-3 grid grid-cols-[1fr_80px_140px_140px_40px] items-center gap-3 px-4 text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-2">
                    {isBatchMode && (
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                        onChange={toggleSelectAll}
                        className="trash-checkbox"
                      />
                    )}
                    <span>文件名</span>
                  </span>
                  <span className="text-center">数量</span>
                  <span className="text-right">最近编辑</span>
                  <span className="text-right">创建时间</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <TrashItem
                      key={item.id}
                      {...item}
                      isBatchMode={isBatchMode}
                      isSelected={selectedIds.has(item.id)}
                      onSelect={toggleSelectItem}
                      onMultiSelect={handleMultiSelect}
                      onRestore={handleRestore}
                      onDeletePermanently={handleDeletePermanently}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      )}
      <FloatingBatchBar
        selectedCount={selectedCount}
        isVisible={isBatchMode}
        onCancel={exitBatchMode}
        onBatchRestore={handleBatchRestore}
        onBatchDelete={handleBatchDelete}
      />
    </>
  );
}
