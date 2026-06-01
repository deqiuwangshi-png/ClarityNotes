"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UserMenuItem {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  dividerAbove?: boolean;
}

export interface UserMenuProps {
  items: UserMenuItem[];
  displayName?: string;
  displayEmail?: string;
  avatarChar?: string;
}

export function UserMenu({
  items,
  displayName = "临时账号",
  displayEmail = "user@example.com",
  avatarChar = "用",
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleItemClick = useCallback((onClick: () => void) => {
    onClick();
    setOpen(false);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-mint-border/30 min-w-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint-accent text-xs font-bold text-white shadow-sm">
          {avatarChar}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold leading-tight text-mint-text truncate">
            {displayName}
          </span>
          <span className="text-[11px] text-mint-muted truncate">
            {displayEmail}
          </span>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-mint-border/30 bg-white py-1.5 shadow-xl">
          {items.map((item) => (
            <div key={item.label}>
              {item.dividerAbove && <div className="my-1 border-t border-mint-border/20" />}
              <button
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition cursor-pointer ${
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-mint-text hover:bg-mint-hover/60"
                }`}
                type="button"
                onClick={() => handleItemClick(item.onClick)}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
