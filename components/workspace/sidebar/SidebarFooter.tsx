"use client";

interface SidebarFooterProps {
  onStarredClick?: () => void;
  onTrashClick?: () => void;
  isTrashActive?: boolean;
}

export function SidebarFooter({
  onStarredClick,
  onTrashClick,
  isTrashActive,
}: SidebarFooterProps) {
  return (
    <div className="flex items-center gap-2 pt-4">
      <button
        className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium text-mint-muted transition hover:bg-mint-hover/50 flex-1 text-left"
        type="button"
        onClick={onStarredClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mint-muted">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
        <span>精选</span>
      </button>
      <div className="h-6 w-px rounded-full bg-[#d8e4de]" aria-hidden="true" />
      <button
        className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition flex-1 ${
          isTrashActive
            ? "bg-mint-hover text-mint-accent-light"
            : "hover:bg-mint-hover/50 text-mint-muted"
        }`}
        type="button"
        onClick={onTrashClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isTrashActive ? "text-mint-accent" : "text-mint-muted"}>
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        <span>回收站</span>
      </button>
    </div>
  );
}
