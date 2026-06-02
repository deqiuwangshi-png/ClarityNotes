import { create } from "zustand"
import type { TrashItemData, TreeNode } from "@/types/fileTree"
import { trashRepo } from "@/repositories"
import {
  restoreItem,
  deletePermanently as deletePermanentlyService,
  emptyTrash as emptyTrashService,
  batchRestore as batchRestoreService,
  batchDelete as batchDeleteService,
} from "@/lib/services/trashService"

interface TrashState {
  items: TrashItemData[]
  isBatchMode: boolean
  selectedIds: Set<string>

  refresh: () => void
  enterBatchMode: (initialItemId?: string) => void
  exitBatchMode: () => void
  toggleSelectItem: (itemId: string) => void
  toggleSelectAll: () => void

  restoreItem: (itemId: string, fileTree: TreeNode[]) => { newTree: TreeNode[] } | null
  deletePermanently: (itemId: string) => void
  emptyTrash: () => void
  batchRestore: (fileTree: TreeNode[]) => { newTree: TreeNode[] } | null
  batchDelete: () => void
}

export const useTrashStore = create<TrashState>()((set, get) => ({
  items: trashRepo.getTrash(),
  isBatchMode: false,
  selectedIds: new Set<string>(),

  refresh: () => {
    set({ items: trashRepo.getTrash() })
  },

  enterBatchMode: (initialItemId?: string) => {
    const ids = initialItemId ? new Set([initialItemId]) : new Set<string>()
    set({ isBatchMode: true, selectedIds: ids })
  },

  exitBatchMode: () => {
    set({ isBatchMode: false, selectedIds: new Set<string>() })
  },

  toggleSelectItem: (itemId: string) => {
    set((state) => {
      const next = new Set(state.selectedIds)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return { selectedIds: next }
    })
  },

  toggleSelectAll: () => {
    set((state) => {
      const allIds = state.items.map((i) => i.id)
      if (state.selectedIds.size === allIds.length) {
        return { selectedIds: new Set<string>() }
      }
      return { selectedIds: new Set(allIds) }
    })
  },

  restoreItem: (itemId: string, fileTree: TreeNode[]) => {
    const { items } = get()
    const item = items.find((i) => i.id === itemId)
    if (!item) return null

    const result = restoreItem(item, fileTree)
    if ("error" in result) return null

    set({ items: trashRepo.getTrash() })
    return { newTree: result.newTree }
  },

  deletePermanently: (itemId: string) => {
    deletePermanentlyService(itemId)
    set({ items: trashRepo.getTrash() })
  },

  emptyTrash: () => {
    emptyTrashService()
    set({ items: trashRepo.getTrash() })
  },

  batchRestore: (fileTree: TreeNode[]) => {
    const { items, selectedIds } = get()
    const selectedItems = items.filter((i) => selectedIds.has(i.id))
    if (selectedItems.length === 0) return null

    const result = batchRestoreService(selectedItems, fileTree)
    set({ items: trashRepo.getTrash(), isBatchMode: false, selectedIds: new Set<string>() })
    return { newTree: result.newTree }
  },

  batchDelete: () => {
    const { selectedIds } = get()
    batchDeleteService(Array.from(selectedIds))
    set({ items: trashRepo.getTrash(), isBatchMode: false, selectedIds: new Set<string>() })
  },
}))
