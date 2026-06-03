import { create } from "zustand"
import type { SearchResultItem } from "@/types/fileTree"
import { searchNodes } from "@/lib/services/searchService"
import { useFileTreeStore } from "@/store/fileTreeStore"
import { supabaseAuthRepo } from "@/repositories"

const DEBOUNCE_DELAY = 300

interface SearchState {
  query: string
  results: SearchResultItem[]
  isSearching: boolean
  recentSearches: string[]

  setQuery: (value: string) => void
  clearSearch: () => void
  searchFromRecent: (term: string) => void
  removeRecentSearch: (term: string) => void
}

export const useSearchStore = create<SearchState>()((set) => {
  let _debounceTimer: ReturnType<typeof setTimeout> | null = null

  return {
    query: "",
    results: [],
    isSearching: false,
    recentSearches: supabaseAuthRepo.getRecentSearches(),

    setQuery: (value: string) => {
      set({ query: value })

      if (_debounceTimer !== null) clearTimeout(_debounceTimer)

      const trimmed = value.trim()
      if (!trimmed) {
        set({ results: [], isSearching: false })
        return
      }

      _debounceTimer = setTimeout(() => {
        const tree = useFileTreeStore.getState().getTree()
        const results = searchNodes(tree, trimmed)
        const updated = supabaseAuthRepo.addRecentSearch(trimmed)
        set({ results, isSearching: true, recentSearches: updated })
      }, DEBOUNCE_DELAY)
    },

    clearSearch: () => {
      if (_debounceTimer !== null) clearTimeout(_debounceTimer)
      _debounceTimer = null
      set({ query: "", results: [], isSearching: false })
    },

    searchFromRecent: (term: string) => {
      const tree = useFileTreeStore.getState().getTree()
      const results = searchNodes(tree, term)
      set({ query: term, results, isSearching: true })
    },

    removeRecentSearch: (term: string) => {
      const updated = supabaseAuthRepo.removeRecentSearch(term)
      set({ recentSearches: updated })
    },
  }
})
