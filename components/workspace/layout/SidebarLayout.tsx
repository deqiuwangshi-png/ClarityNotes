"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { usePathname } from "next/navigation";
import { UserSection } from "@/components/workspace/sidebar/UserSection";
import { SearchBar } from "@/components/workspace/sidebar/SearchBar";
import { FileTree } from "@/components/workspace/sidebar/FileTree";
import { SearchResultsView } from "@/components/workspace/sidebar/SearchResultsView";
import { SidebarFooter } from "@/components/workspace/sidebar/SidebarFooter";
import { TopBarBreadcrumb } from "@/components/workspace/layout/TopBarBreadcrumb";
import { useSearchStore } from "@/store/searchStore";
import { useFileTreeStore } from "@/store/fileTreeStore";

interface SidebarLayoutContextValue {
  collapsed: boolean
}

const SidebarLayoutContext = createContext<SidebarLayoutContextValue>({ collapsed: false })

export function useSidebarLayout(): SidebarLayoutContextValue {
  return useContext(SidebarLayoutContext)
}

interface SidebarLayoutProps {
  children: ReactNode;
  userInfo: { displayName: string; email: string; avatarInitial: string };
  isTrashActive?: boolean;
}

export function SidebarLayout({
  children,
  userInfo,
  isTrashActive,
}: SidebarLayoutProps) {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const isWorkspace = pathname === "/workspace";

  const isSearching = useSearchStore((s) => s.isSearching);
  const searchQuery = useSearchStore((s) => s.query);
  const searchResults = useSearchStore((s) => s.results);
  const recentSearches = useSearchStore((s) => s.recentSearches);
  const clearSearch = useSearchStore((s) => s.clearSearch);
  const searchFromRecent = useSearchStore((s) => s.searchFromRecent);
  const removeRecentSearch = useSearchStore((s) => s.removeRecentSearch);
  const selectNode = useFileTreeStore((s) => s.selectNode);

  const handleSearchSelect = useCallback(
    (nodeId: string) => {
      selectNode(nodeId);
    },
    [selectNode],
  );

  const handleSearchClear = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  const handleSearchRecent = useCallback(
    (term: string) => {
      searchFromRecent(term);
    },
    [searchFromRecent],
  );

  const handleRemoveRecentSearch = useCallback(
    (term: string) => {
      removeRecentSearch(term);
    },
    [removeRecentSearch],
  );

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
        <div className="flex flex-col h-full p-5">
          <UserSection user={userInfo} onToggleSidebar={toggle} />
          <SearchBar onClear={handleSearchClear} />
          {isSearching && searchQuery ? (
            <SearchResultsView
              results={searchResults}
              query={searchQuery}
              recentSearches={recentSearches}
              onSelect={handleSearchSelect}
              onSearchRecent={handleSearchRecent}
              onRemoveRecent={handleRemoveRecentSearch}
            />
          ) : (
            <FileTree />
          )}
          <SidebarFooter isTrashActive={isTrashActive} />
        </div>
      </aside>
      <div className="flex flex-1 min-w-0 flex-col">
        {collapsed && (
          <div className="flex items-center gap-2 border-b border-mint-border/20 bg-mint-bg px-4 py-3">
            <button
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-mint-muted transition hover:bg-mint-border/30 hover:text-mint-accent cursor-pointer"
              onClick={toggle}
              type="button"
              aria-label="展开侧边栏"
            >
              <span className="material-symbols-outlined text-[18px]">menu</span>
            </button>
            {isWorkspace ? (
              <TopBarBreadcrumb />
            ) : isTrashActive ? (
              <span className="text-[13px] font-semibold text-[#121c2a]">回收站</span>
            ) : null}
          </div>
        )}
        <SidebarLayoutContext.Provider value={{ collapsed }}>
          <div className="flex-1 min-h-0">{children}</div>
        </SidebarLayoutContext.Provider>
      </div>
    </div>
  );
}
