import type { User } from "@/types/auth"
import type { TreeNode, TrashItemData, UserInfo, DropdownMenuItem } from "@/types/fileTree"

export interface IUserRepository {
  MOCK_USERS: (User & { password: string })[]
  findUserByEmail(email: string): User | undefined
  findUserCredentials(email: string, password: string): (User & { password: string }) | undefined
  getPasswordForUser(userId: string): string | undefined
  updatePassword(userId: string, newPassword: string): void
  addUser(user: User & { password: string }): void
  getUserFromStorage(): User | null
  updateUserInStorage(user: User): void
}

export interface IFileTreeRepository {
  getTree(): TreeNode[]
  setTree(newTree: TreeNode[]): void
  resetTree(): void
}

export interface ITrashRepository {
  getTrash(): TrashItemData[]
  setTrash(items: TrashItemData[]): void
  addToTrash(item: TrashItemData): void
  removeFromTrash(id: string): void
  clearTrash(): void
}

export interface IWorkspaceRepository {
  mockUser: UserInfo
  mockMenuActions: DropdownMenuItem[]
}

export interface ISessionRepository {
  createSession(user: User, rememberMe?: boolean): void
  clearSession(): void
  getCurrentUser(): User | null
  clearAllData(): void
}
