"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";

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

function FloatingMenu({ triggerRef, open, onClose, children, width }: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: number;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: Math.max(8, rect.left) });
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return createPortal(
    <div ref={menuRef} className="fixed z-100 rounded-lg border border-mint-border/30 bg-white py-1 shadow-lg" style={{ top: pos.top, left: pos.left, width }}>
      {children}
    </div>,
    document.body,
  );
}
