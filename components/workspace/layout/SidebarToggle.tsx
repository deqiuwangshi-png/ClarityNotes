"use client";

interface SidebarToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ visible, onToggle }: SidebarToggleProps) {
  if (!visible) return null;

  return (
    <div className="flex flex-col items-center justify-start gap-2 border-r border-mint-border/30 bg-mint-bg p-2">
      <button
        className="flex size-8 items-center justify-center rounded-lg text-mint-muted transition hover:bg-mint-border/30 hover:text-mint-accent cursor-pointer"
        onClick={onToggle}
        type="button"
        aria-label="展开侧边栏"
      >
        <span className="material-symbols-outlined text-[18px]">menu_open</span>
      </button>
    </div>
  );
}
