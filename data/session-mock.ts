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
