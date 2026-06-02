import type { User } from "@/types/auth"
import type { ISessionRepository } from "@/repositories/types"
import {
  createSession,
  updateSessionUser,
  clearSession,
  getCurrentUser,
  clearAllData,
  getRecentSearches,
  setRecentSearches,
} from "@/data/session-mock"

export class MockSessionRepository implements ISessionRepository {
  createSession(user: User, rememberMe?: boolean): void {
    createSession(user, rememberMe)
  }

  updateSessionUser(user: User): void {
    updateSessionUser(user)
  }

  clearSession(): void {
    clearSession()
  }

  getCurrentUser(): User | null {
    return getCurrentUser()
  }

  clearAllData(): void {
    clearAllData()
  }

  getRecentSearches(): string[] {
    return getRecentSearches()
  }

  setRecentSearches(searches: string[]): void {
    setRecentSearches(searches)
  }
}
