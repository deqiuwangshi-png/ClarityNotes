import type { IWorkspaceRepository } from "@/repositories/types"
import { mockUser, mockMenuActions } from "@/data/workspace-mock"

export class MockWorkspaceRepository implements IWorkspaceRepository {
  readonly mockUser = mockUser
  readonly mockMenuActions = mockMenuActions
}
