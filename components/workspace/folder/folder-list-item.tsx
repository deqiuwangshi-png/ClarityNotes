"use client";

import { useState, useRef, useCallback } from "react";
import { FloatingMenu } from "@/components/ui/floating-menu";
import { useFileTreeStore } from "@/store/fileTreeStore";
import { useUiStore } from "@/store/uiStore";
import type { FolderItem } from "@/types/fileTree";

interface FolderListItemProps {
  item: FolderItem;
  onClick: (itemId: string) => void;
}

export function FolderListItem({ item, onClick: _onClick }: FolderListItemProps) {
  const isFolder = item.type === "folder";
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.name);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commitRename = useFileTreeStore((s) => s.commitRename);
  const deleteNode = useFileTreeStore((s) => s.deleteNode);
  const validateCreateName = useFileTreeStore((s) => s.validateCreateName);
  const openConfirm = useUiStore((s) => s.openConfirm);

  const startRename = useCallback(() => {
    setMenuOpen(false);
    setRenaming(true);
    setRenameValue(item.type === "file" ? item.name.replace(/\.md$/, "") : item.name);
    setErrorMsg(null);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [item]);

  const commit = useCallback(() => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setErrorMsg("名称不能为空");
      return;
    }
    const validationError = validateCreateName(item.id, trimmed);
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    const finalName = item.type === "file" && !trimmed.endsWith(".md")
      ? trimmed + ".md"
      : trimmed;
    commitRename(item.id, finalName);
    setRenaming(false);
    setErrorMsg(null);
  }, [renameValue, item, validateCreateName, commitRename]);

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") {
      setRenaming(false);
      setRenameValue(item.name);
      setErrorMsg(null);
    }
  }, [commit, item.name]);

  const handleDelete = useCallback(async () => {
    setMenuOpen(false);
    const confirmed = await openConfirm({
      title: "删除确认",
      message: `确定要删除"${item.name}"吗？删除后将移入回收站。`,
      confirmLabel: "删除",
      variant: "danger",
    });
    if (confirmed) {
      deleteNode(item.id);
    }
  }, [item, openConfirm, deleteNode]);

  const handleClick = useCallback(() => {
    if (!renaming) _onClick(item.id);
  }, [renaming, _onClick, item.id]);

  return (
    <div
      className="group grid w-full grid-cols-[1fr_140px_140px_40px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md hover:bg-mint-hover/70 cursor-pointer"
      onClick={handleClick}
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
        {renaming ? (
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              className="w-full truncate rounded border px-1 box-border text-[13px] text-mint-text outline-none font-medium m-0 py-0 appearance-none min-w-0 leading-normal border-mint-accent"
              value={renameValue}
              onChange={(e) => { setRenameValue(e.target.value); setErrorMsg(null); }}
              onBlur={commit}
              onKeyDown={handleRenameKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
            {errorMsg && (
              <div className="absolute left-0 top-full mt-0.5 z-50 whitespace-nowrap rounded bg-red-600 px-2 py-0.5 text-[11px] text-white shadow">
                {errorMsg}
              </div>
            )}
          </div>
        ) : (
          <span className="truncate text-[13px] font-medium text-mint-text">
            {item.type === "file" ? item.name.replace(/\.md$/, "") : item.name}
          </span>
        )}
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
              onClick={startRename}
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
