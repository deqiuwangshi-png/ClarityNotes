"use client";

import { useState, useCallback } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { DropdownMenuItem } from "@/types/fileTree";

interface TopBarDropdownProps {
  items: DropdownMenuItem[];
  onAction: (actionKey: string) => void;
}

export function TopBarDropdown({ items, onAction }: TopBarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutside<HTMLDivElement>(closeMenu);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex size-8 items-center justify-center rounded-full text-sm font-semibold text-mint-muted transition hover:bg-[#f7faf8] hover:text-mint-accent"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-label="更多操作"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-[20px]">
          more_vert
        </span>
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-mint-border bg-white py-2 shadow-xl ${
          isOpen ? "" : "hidden"
        }`}
      >
        {items.map((item) => (
          <button
            key={item.key}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-mint-text transition hover:bg-surface-container-high"
            type="button"
            onClick={() => {
              onAction(item.key);
              setIsOpen(false);
            }}
          >
            <span className="material-symbols-outlined text-[18px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
