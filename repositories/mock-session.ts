import type { User } from "@/types/auth"
import type { ISessionRepository } from "@/repositories/types"
import {
  createSession,
  clearSession,
  getCurrentUser,
  clearAllData,
} from "@/data/session-mock"

export class MockSessionRepository implements ISessionRepository {
  createSession(user: User, rememberMe?: boolean): void {
    createSession(user, rememberMe)
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
}
