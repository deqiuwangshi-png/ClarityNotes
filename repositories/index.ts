import type {
  IUserRepository,
  IFileTreeRepository,
  ITrashRepository,
  IWorkspaceRepository,
  ISessionRepository,
} from "@/repositories/types"

import { MockUserRepository } from "@/repositories/mock-users"
import { MockFileTreeRepository } from "@/repositories/mock-fileTree"
import { MockTrashRepository } from "@/repositories/mock-trash"
import { MockWorkspaceRepository } from "@/repositories/mock-workspace"
import { MockSessionRepository } from "@/repositories/mock-session"

export const userRepo: IUserRepository = new MockUserRepository()
export const fileTreeRepo: IFileTreeRepository = new MockFileTreeRepository()
export const trashRepo: ITrashRepository = new MockTrashRepository()
export const workspaceRepo: IWorkspaceRepository = new MockWorkspaceRepository()
export const sessionRepo: ISessionRepository = new MockSessionRepository()

export type {
  IUserRepository,
  IFileTreeRepository,
  ITrashRepository,
  IWorkspaceRepository,
  ISessionRepository,
}
