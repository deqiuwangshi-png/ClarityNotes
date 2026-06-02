import type { User } from "@/types/auth"
import type { IUserRepository } from "@/repositories/types"
import {
  findUserByEmail,
  findUserCredentials,
  getPasswordForUser,
  updatePassword,
  addUser,
} from "@/data/mockUsers"

export class MockUserRepository implements IUserRepository {
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
}
