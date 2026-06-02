import type { User } from "@/types/auth"
import type { IUserRepository } from "@/repositories/types"
import {
  MOCK_USERS,
  findUserByEmail,
  findUserCredentials,
  getPasswordForUser,
  updatePassword,
  addUser,
  getUserFromStorage,
  updateUserInStorage,
} from "@/data/mockUsers"

export class MockUserRepository implements IUserRepository {
  readonly MOCK_USERS = MOCK_USERS

  findUserByEmail(email: string): User | undefined {
    return findUserByEmail(email)
  }

  findUserCredentials(email: string, password: string): (User & { password: string }) | undefined {
    return findUserCredentials(email, password)
  }

  getPasswordForUser(userId: string): string | undefined {
    return getPasswordForUser(userId)
  }

  updatePassword(userId: string, newPassword: string): void {
    updatePassword(userId, newPassword)
  }

  addUser(user: User & { password: string }): void {
    addUser(user)
  }

  getUserFromStorage(): User | null {
    return getUserFromStorage()
  }

  updateUserInStorage(user: User): void {
    updateUserInStorage(user)
  }
}
