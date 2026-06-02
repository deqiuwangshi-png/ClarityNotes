import type { User } from "@/types/auth"
import type { IUserRepository } from "@/repositories/types"
import {
  MOCK_USERS,
  findUserByEmail,
  addUser,
  getUserFromStorage,
  updateUserInStorage,
} from "@/data/mockUsers"

export class MockUserRepository implements IUserRepository {
  readonly MOCK_USERS = MOCK_USERS

  findUserByEmail(email: string): User | undefined {
    return findUserByEmail(email)
  }

  addUser(user: User): void {
    addUser(user)
  }

  getUserFromStorage(): User | null {
    return getUserFromStorage()
  }

  updateUserInStorage(user: User): void {
    updateUserInStorage(user)
  }
}
