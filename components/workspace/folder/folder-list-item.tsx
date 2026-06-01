"use client";

import type { FolderItem } from "@/types/workspace";

interface FolderListItemProps {
  item: FolderItem;
  onClick: (itemId: string) => void;
  onMore: (itemId: string) => void;
}

export function FolderListItem({ item, onClick, onMore }: FolderListItemProps) {
  const isFolder = item.type === "folder";

  return (
    <div
      className="group grid w-full grid-cols-[1fr_140px_140px_40px] items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md hover:bg-mint-hover/70 cursor-pointer"
      onClick={() => onClick(item.id)}
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
      <span className="flex justify-end opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          className="flex size-8 items-center justify-center rounded-full text-outline transition hover:bg-[#ebefeb] hover:text-mint-accent"
          type="button"
          aria-label="更多操作"
          onClick={(e) => {
            e.stopPropagation();
            onMore(item.id);
          }}
        >
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </span>
    </div>
  );
}
