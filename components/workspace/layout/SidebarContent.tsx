"use client"

import { useCallback } from "react"
import { UserSection } from "@/components/workspace/sidebar/UserSection"
import { SearchBar } from "@/components/workspace/sidebar/SearchBar"
import { FileTree } from "@/components/workspace/sidebar/FileTree"
import { SearchResultsView } from "@/components/workspace/sidebar/SearchResultsView"
import { SidebarFooter } from "@/components/workspace/sidebar/SidebarFooter"
import { useSearchStore } from "@/store/searchStore"
import { useFileTreeStore } from "@/store/fileTreeStore"
import { useFileTreeDataStore } from "@/store/fileTreeDataStore"

interface SidebarContentProps {
  isTrashActive: boolean
  onToggleSidebar: () => void
  onTrashClick?: () => void
}

export function SidebarContent({ isTrashActive, onToggleSidebar, onTrashClick }: SidebarContentProps) {
  const isSearching = useSearchStore((s) => s.isSearching)
  const searchQuery = useSearchStore((s) => s.query)
  const searchResults = useSearchStore((s) => s.results)
  const recentSearches = useSearchStore((s) => s.recentSearches)
  const clearSearch = useSearchStore((s) => s.clearSearch)
  const searchFromRecent = useSearchStore((s) => s.searchFromRecent)
  const removeRecentSearch = useSearchStore((s) => s.removeRecentSearch)
  const selectNode = useFileTreeStore((s) => s.selectNode)

  const tree = useFileTreeDataStore((s) => s.getTree())

  const handleSearchSelect = useCallback(
    (nodeId: string) => selectNode(nodeId),
    [selectNode],
  )
  const handleSearchClear = useCallback(() => clearSearch(), [clearSearch])
  const handleSearchRecent = useCallback(
    (term: string) => searchFromRecent(term, tree),
    [searchFromRecent, tree],
  )
  const handleQueryChange = useCallback(
    (value: string) => {
      const setQuery = useSearchStore.getState().setQuery
      setQuery(value, tree)
    },
    [tree],
  )
  const handleRemoveRecentSearch = useCallback(
    (term: string) => removeRecentSearch(term),
    [removeRecentSearch],
  )

  return (
    <div className="flex flex-col h-full p-5">
      <UserSection onToggleSidebar={onToggleSidebar} />
      <SearchBar onClear={handleSearchClear} onQueryChange={handleQueryChange} />
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
      <SidebarFooter isTrashActive={isTrashActive} onTrashClick={onTrashClick} />
    </div>
  )
}
