"use client"

import { TopBarBreadcrumb } from "@/components/workspace/layout/TopBarBreadcrumb"

interface CollapsedTopBarProps {
  onToggle: () => void
  isWorkspace: boolean
  isTrashActive: boolean
}

export function CollapsedTopBar({ onToggle, isWorkspace, isTrashActive }: CollapsedTopBarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-mint-border/20 bg-mint-bg px-4 py-3">
      <button
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-mint-muted transition hover:bg-mint-border/30 hover:text-mint-accent cursor-pointer"
        onClick={onToggle}
        type="button"
        aria-label="展开侧边栏"
      >
        <span className="material-symbols-outlined text-[18px]">menu</span>
      </button>
      {isTrashActive ? (
        <span className="text-[13px] font-semibold text-[#121c2a]">回收站</span>
      ) : isWorkspace ? (
        <TopBarBreadcrumb />
      ) : null}
    </div>
  )
}
