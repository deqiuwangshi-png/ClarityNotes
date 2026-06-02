"use client";

import { useState, useRef } from "react";
import { FloatingMenu } from "@/components/ui/floating-menu";

interface TreeItemMenuProps {
  showPlus: boolean;
  canCreateFolder: boolean;
  isRoot: boolean;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onRenameStart: () => void;
  onDelete: () => void;
}

export function TreeItemMenu({ showPlus, canCreateFolder, isRoot, onCreateFolder, onCreateFile, onRenameStart, onDelete }: TreeItemMenuProps) {
  const [plusOpen, setPlusOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const plusBtnRef = useRef<HTMLButtonElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover/tree-row:opacity-100 transition-opacity">
      {showPlus && (
        <div className="relative">
          <button
            ref={plusBtnRef}
            className="flex size-5 items-center justify-center rounded text-[#6B7280] hover:bg-[#e1eae5]"
            type="button"
            aria-label="新建"
            onClick={(e) => { e.stopPropagation(); setPlusOpen((v) => !v); setMoreOpen(false); }}
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
          </button>
          <FloatingMenu triggerRef={plusBtnRef} open={plusOpen} onClose={() => setPlusOpen(false)} width={144}>
            {canCreateFolder && (
              <button className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-mint-text hover:bg-mint-hover/60" type="button" onClick={() => { onCreateFolder(); setPlusOpen(false); }}>
                <span className="material-symbols-outlined text-[14px]">create_new_folder</span>
                <span>新建文件夹</span>
              </button>
            )}
            <button className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-mint-text hover:bg-mint-hover/60" type="button" onClick={() => { onCreateFile(); setPlusOpen(false); }}>
              <span className="material-symbols-outlined text-[14px]">note_add</span>
              <span>新建文档</span>
            </button>
          </FloatingMenu>
        </div>
      )}

      {!isRoot && (
        <div className="relative">
          <button
            ref={moreBtnRef}
            className="flex size-5 items-center justify-center rounded text-[#6B7280] hover:bg-[#e1eae5]"
            type="button"
            aria-label="更多"
            onClick={(e) => { e.stopPropagation(); setMoreOpen((v) => !v); setPlusOpen(false); }}
          >
            <span className="material-symbols-outlined text-[14px]">more_horiz</span>
          </button>
          <FloatingMenu triggerRef={moreBtnRef} open={moreOpen} onClose={() => setMoreOpen(false)} width={112}>
            <button className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-mint-text hover:bg-mint-hover/60" type="button" onClick={() => { onRenameStart(); setMoreOpen(false); }}>
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>重命名</span>
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50" type="button" onClick={() => { onDelete(); setMoreOpen(false); }}>
              <span className="material-symbols-outlined text-[14px]">delete</span>
              <span>删除</span>
            </button>
          </FloatingMenu>
        </div>
      )}
    </div>
  );
}
