"use client";

import { useState, useRef, useCallback } from "react";
import { FloatingMenu } from "@/components/ui/floating-menu";
import { useFileTreeStore } from "@/store/fileTreeStore";
import type { FolderItem } from "@/types/fileTree";

interface FolderListItemProps {
  item: FolderItem;
  onClick: (itemId: string) => void;
}

export function FolderListItem({ item, onClick: _onClick }: FolderListItemProps) {
  const isFolder = item.type === "folder";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const commitRename = useFileTreeStore((s) => s.commitRename);
  const deleteNode = useFileTreeStore((s) => s.deleteNode);

  const handleRename = useCallback(() => {
    setMenuOpen(false);
    const newName = window.prompt("请输入新名称", item.name.replace(/\.md$/, ""));
    if (newName && newName.trim() && newName.trim() !== item.name.replace(/\.md$/, "")) {
      const finalName = item.type === "file" && !newName.endsWith(".md") ? newName.trim() + ".md" : newName.trim();
      commitRename(item.id, finalName);
    }
  }, [item, commitRename]);

  const handleDelete = useCallback(() => {
    setMenuOpen(false);
    const confirmed = window.confirm("确定要删除吗？删除后将移入回收站。");
    if (confirmed) {
      deleteNode(item.id);
    }
  }, [item.id, deleteNode]);

  return (
    <div
      className="group grid w-full grid-cols-[1fr_140px_140px_40px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md hover:bg-mint-hover/70 cursor-pointer"
      onClick={() => _onClick(item.id)}
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
            isFolder
              ? "bg-mint-hover text-mint-accent-light"
              : "bg-mint-bg text-[#6B7280]"
          }`}
        >
          <span
            className={`material-symbols-outlined ${isFolder ? "filled" : ""} text-[18px]`}
          >
            {isFolder ? "folder" : "description"}
          </span>
        </span>
        <span className="truncate text-[13px] font-medium text-mint-text">
          {item.type === "file" ? item.name.replace(/\.md$/, "") : item.name}
        </span>
      </span>
      <span className="text-right text-xs text-[#9CA3AF]">
        {item.lastModified}
      </span>
      <span className="text-right text-xs text-[#9CA3AF]">
        {item.createdAt}
      </span>
      <span className="flex justify-end">
        <div className="relative opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            ref={menuBtnRef}
            className="flex size-8 items-center justify-center rounded-full text-outline transition hover:bg-[#ebefeb] hover:text-mint-accent"
            type="button"
            aria-label="更多操作"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>
          <FloatingMenu
            triggerRef={menuBtnRef}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            width={112}
          >
            <button
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-mint-text hover:bg-mint-hover/60"
              type="button"
              onClick={handleRename}
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              <span>重命名</span>
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50"
              type="button"
              onClick={handleDelete}
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              <span>删除</span>
            </button>
          </FloatingMenu>
        </div>
      </span>
    </div>
  );
}
