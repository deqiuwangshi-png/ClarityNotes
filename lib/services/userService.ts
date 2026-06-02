import type { User } from "@/types/auth"
import { userRepo, sessionRepo } from "@/repositories"

export function validateOldPassword(user: User, oldPassword: string): boolean {
  const stored = userRepo.getPasswordForUser(user.id)
  return stored === oldPassword
}

export function updatePassword(userId: string, newPassword: string): void {
  userRepo.updatePassword(userId, newPassword)
}

export function updateUserInfo(user: User, updates: Partial<User>): User {
  const updated: User = { ...user, ...updates }
  userRepo.updateUserInStorage(updated)
  return updated
}

export function clearAllUserData(): void {
  sessionRepo.clearAllData()
}
