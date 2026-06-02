import type { User } from "@/types/auth"

const SESSION_KEY = 'claritynotes_auth_user'

export function createSession(user: User, rememberMe?: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  if (!rememberMe) {
    sessionStorage.setItem(SESSION_KEY, 'temp')
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
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      return JSON.parse(stored) as User
    }
  } catch {
    localStorage.removeItem(SESSION_KEY)
  }
  return null
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return
  localStorage.clear()
  sessionStorage.clear()
}
