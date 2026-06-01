"use client";

import type { ReactNode } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { UserSection } from "@/components/workspace/sidebar/UserSection";
import { SearchBar } from "@/components/workspace/sidebar/SearchBar";
import { FileTree } from "@/components/workspace/sidebar/FileTree";
import { SidebarFooter } from "@/components/workspace/sidebar/SidebarFooter";
import { SidebarToggle } from "@/components/workspace/layout/SidebarToggle";

interface SidebarLayoutProps {
  children: ReactNode;
  userInfo: { displayName: string; email: string; avatarInitial: string };
  onSearch?: (query: string) => void;
  isTrashActive?: boolean;
}

export function SidebarLayout({
  children,
  userInfo,
  onSearch,
  isTrashActive,
}: SidebarLayoutProps) {
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`flex h-screen shrink-0 flex-col border-r border-mint-border/30 bg-mint-bg shadow-sm transition-all duration-250 overflow-hidden ${
          collapsed ? "w-0 opacity-0 border-none" : "w-[280px] opacity-100"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.4, 1.1)" }}
      >
        <div className="flex flex-col h-full p-5">
          <UserSection user={userInfo} onToggleSidebar={toggle} />
          <SearchBar value="" onChange={onSearch ?? (() => {})} />
          <FileTree />
          <SidebarFooter isTrashActive={isTrashActive} />
        </div>
      </aside>
      <SidebarToggle visible={collapsed} onToggle={toggle} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
