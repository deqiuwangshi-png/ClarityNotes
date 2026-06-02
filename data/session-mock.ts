import type { User } from "@/types/auth"

const SESSION_KEY = 'claritynotes_auth_user'

export function createSession(user: User, rememberMe?: boolean): void {
  if (typeof window === 'undefined') return
  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    sessionStorage.removeItem(SESSION_KEY)
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
    localStorage.removeItem(SESSION_KEY)
  }
}

export function updateSessionUser(user: User): void {
  if (typeof window === 'undefined') return
  const key = localStorage.getItem(SESSION_KEY) !== null ? localStorage : sessionStorage
  key.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY)
    if (stored) {
      return JSON.parse(stored) as User
    }
  } catch {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  }
  return null
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return
  localStorage.clear()
  sessionStorage.clear()
}

const SEARCH_RECENT_KEY = 'claritynotes_recent_searches'

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SEARCH_RECENT_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function setRecentSearches(searches: string[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(searches))
  } catch {
    /* ignore quota */
  }
}
