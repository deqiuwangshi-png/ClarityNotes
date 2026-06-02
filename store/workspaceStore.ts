import { create } from "zustand"
import type { UserInfo, DropdownMenuItem } from "@/types/fileTree"
import { workspaceRepo } from "@/repositories"

interface WorkspaceState {
  mockUser: UserInfo
  mockMenuActions: DropdownMenuItem[]
}

export const useWorkspaceStore = create<WorkspaceState>()(() => ({
  mockUser: workspaceRepo.mockUser,
  mockMenuActions: workspaceRepo.mockMenuActions,
}))
