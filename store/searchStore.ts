import { create } from "zustand"
import type { SearchResultItem } from "@/types/fileTree"
import { searchNodes } from "@/lib/services/searchService"
import { useFileTreeStore } from "@/store/fileTreeStore"

const DEBOUNCE_DELAY = 300
const RECENT_KEY = "claritynotes_recent_searches"
const MAX_RECENT = 5

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

function saveRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(searches))
  } catch {
    /* ignore quota errors */
  }
}

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

let debounceTimer: ReturnType<typeof setTimeout> | null = null

export const useSearchStore = create<SearchState>()((set) => ({
  query: "",
  results: [],
  isSearching: false,
  recentSearches: loadRecentSearches(),

  setQuery: (value: string) => {
    set({ query: value })

    if (debounceTimer !== null) clearTimeout(debounceTimer)

    const trimmed = value.trim()
    if (!trimmed) {
      set({ results: [], isSearching: false })
      return
    }

    debounceTimer = setTimeout(() => {
      const tree = useFileTreeStore.getState().tree
      const results = searchNodes(tree, trimmed)
      const recent = loadRecentSearches()
      const updated = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, MAX_RECENT)
      saveRecentSearches(updated)
      set({ results, isSearching: true, recentSearches: updated })
    }, DEBOUNCE_DELAY)
  },

  clearSearch: () => {
    if (debounceTimer !== null) clearTimeout(debounceTimer)
    debounceTimer = null
    set({ query: "", results: [], isSearching: false })
  },

  searchFromRecent: (term: string) => {
    const tree = useFileTreeStore.getState().tree
    const results = searchNodes(tree, term)
    set({ query: term, results, isSearching: true })
  },

  removeRecentSearch: (term: string) => {
    const updated = loadRecentSearches().filter((r) => r !== term)
    saveRecentSearches(updated)
    set({ recentSearches: updated })
  },
}))
