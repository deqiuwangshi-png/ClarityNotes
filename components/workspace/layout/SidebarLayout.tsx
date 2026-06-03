"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { usePathname } from "next/navigation";
import { SidebarContent } from "@/components/workspace/layout/SidebarContent";
import { CollapsedTopBar } from "@/components/workspace/layout/CollapsedTopBar";

interface SidebarLayoutContextValue {
  collapsed: boolean
}

const SidebarLayoutContext = createContext<SidebarLayoutContextValue>({ collapsed: false })

export function useSidebarLayout(): SidebarLayoutContextValue {
  return useContext(SidebarLayoutContext)
}

interface SidebarLayoutProps {
  children: ReactNode;
  isTrashActive?: boolean;
  onTrashClick?: () => void;
}

export function SidebarLayout({
  children,
  isTrashActive = false,
  onTrashClick,
}: SidebarLayoutProps) {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const isWorkspace = pathname === "/workspace";

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className="flex h-screen shrink-0 flex-col border-r border-mint-border/30 bg-mint-bg shadow-sm transition-[transform,margin-right] duration-250"
        style={{
          width: 280,
          transform: collapsed ? "translateX(-280px)" : "translateX(0)",
          marginRight: collapsed ? -280 : 0,
          transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.4, 1.1)",
        }}
      >
        <SidebarContent
          isTrashActive={isTrashActive}
          onToggleSidebar={toggle}
          onTrashClick={onTrashClick}
        />
      </aside>
      <div className="flex flex-1 min-w-0 flex-col">
        {collapsed && (
          <CollapsedTopBar
            onToggle={toggle}
            isWorkspace={isWorkspace}
            isTrashActive={isTrashActive}
          />
        )}
        <SidebarLayoutContext.Provider value={{ collapsed }}>
          <div className="flex-1 min-h-0">{children}</div>
        </SidebarLayoutContext.Provider>
      </div>
    </div>
  );
}
