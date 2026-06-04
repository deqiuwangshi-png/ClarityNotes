const SEARCH_RECENT_KEY = 'claritynotes_recent_searches'
const MAX_RECENT = 5

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SEARCH_RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function addRecentSearch(term: string): string[] {
  if (typeof window === 'undefined') return [term]
  const current = getRecentSearches()
  const updated = [term, ...current.filter((r) => r !== term)].slice(0, MAX_RECENT)
  try {
    localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(updated))
  } catch {
    /* ignore quota */
  }
  return updated
}

export function removeRecentSearch(term: string): string[] {
  if (typeof window === 'undefined') return []
  const updated = getRecentSearches().filter((r) => r !== term)
  try {
    localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(updated))
  } catch {
    /* ignore quota */
  }
  return updated
}
