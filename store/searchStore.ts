import { create } from "zustand"
import type { SearchResultItem, TreeNode } from "@/types/fileTree"
import { searchNodes } from "@/lib/services/searchService"
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
} from "@/utils/recentSearches"

const DEBOUNCE_DELAY = 300

interface SearchState {
  query: string
  results: SearchResultItem[]
  isSearching: boolean
  recentSearches: string[]

  setQuery: (value: string, tree: TreeNode[]) => void
  clearSearch: () => void
  searchFromRecent: (term: string, tree: TreeNode[]) => void
  removeRecentSearch: (term: string) => void
}

export const useSearchStore = create<SearchState>()((set) => {
  let _debounceTimer: ReturnType<typeof setTimeout> | null = null

  return {
    query: "",
    results: [],
    isSearching: false,
    recentSearches: getRecentSearches(),

    setQuery: (value: string, tree: TreeNode[]) => {
      set({ query: value })

      if (_debounceTimer !== null) clearTimeout(_debounceTimer)

      const trimmed = value.trim()
      if (!trimmed) {
        set({ results: [], isSearching: false })
        return
      }

      _debounceTimer = setTimeout(() => {
        const results = searchNodes(tree, trimmed)
        const updated = addRecentSearch(trimmed)
        set({ results, isSearching: true, recentSearches: updated })
      }, DEBOUNCE_DELAY)
    },

    clearSearch: () => {
      if (_debounceTimer !== null) clearTimeout(_debounceTimer)
      _debounceTimer = null
      set({ query: "", results: [], isSearching: false })
    },

    searchFromRecent: (term: string, tree: TreeNode[]) => {
      const results = searchNodes(tree, term)
      set({ query: term, results, isSearching: true })
    },

    removeRecentSearch: (term: string) => {
      const updated = removeRecentSearch(term)
      set({ recentSearches: updated })
    },
  }
})
