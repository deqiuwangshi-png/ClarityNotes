"use client";

import { useState, useRef } from "react";
import { FloatingMenu } from "@/components/ui/floating-menu";
import type { TrashItemData } from "@/types/fileTree";

interface TrashItemProps extends TrashItemData {
  isBatchMode: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMultiSelect: (id: string) => void;
  onRestore: (id: string) => void;
  onDeletePermanently: (id: string) => void;
  onPreview: (item: TrashItemData) => void;
}

export function TrashItem({
  id,
  type,
  name,
  count,
  lastModified,
  createdAt,
  content,
  wordCount,
  isBatchMode,
  isSelected,
  onSelect,
  onMultiSelect,
  onRestore,
  onDeletePermanently,
  onPreview,
}: TrashItemProps) {
  const isFolder = type === "folder";
  const countLabel = isFolder ? `${count ?? 0} 项` : "—";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className={`group grid w-full grid-cols-[1fr_80px_140px_140px_40px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:bg-mint-hover/70 cursor-pointer ${
        isSelected ? "ring-2 ring-mint-accent/30 bg-mint-hover/40" : ""
      }`}
      onClick={() => {
        if (isBatchMode) {
          onSelect(id);
        } else if (type === "file") {
          onPreview({ id, type, name, count, lastModified, createdAt, content, wordCount });
        }
      }}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
            isFolder ? "bg-mint-hover text-mint-accent-light" : "bg-mint-bg text-[#6B7280]"
          }`}
        >
          <span className={`material-symbols-outlined ${isFolder ? "filled" : ""} text-[18px]`}>
            {isFolder ? "folder" : "description"}
          </span>
        </span>
        <span className="truncate text-[13px] font-medium text-mint-text">
          {type === "file" ? name.replace(/\.md$/, "") : name}
        </span>
      </span>
      <span className="text-center text-xs text-[#9CA3AF]">{countLabel}</span>
      <span className="text-right text-xs text-[#9CA3AF]">{lastModified}</span>
      <span className="text-right text-xs text-[#9CA3AF]">{createdAt}</span>
      <span className="flex justify-end">
        {isBatchMode ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(id)}
            className="trash-checkbox"
          />
        ) : (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              ref={menuBtnRef}
              className="flex size-7 items-center justify-center rounded text-mint-muted hover:bg-[#ebefeb] hover:text-mint-accent"
              type="button"
              aria-label="更多操作"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
            >
              <span className="material-symbols-outlined text-[16px]">more_horiz</span>
            </button>
            <FloatingMenu
              triggerRef={menuBtnRef}
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              width={128}
            >
              <button
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-mint-text hover:bg-mint-hover/60"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onMultiSelect(id);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">checklist</span>
                <span>多选</span>
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-mint-text hover:bg-mint-hover/60"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onRestore(id);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">restore</span>
                <span>恢复</span>
              </button>
              <button
                className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDeletePermanently(id);
                }}
              >
                <span className="material-symbols-outlined text-[14px]">delete_forever</span>
                <span>彻底删除</span>
              </button>
            </FloatingMenu>
          </div>
        )}
      </span>
    </div>
  );
}
