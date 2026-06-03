import { create } from "zustand"
import type { TrashItemData } from "@/types/fileTree"
import { trashRepo } from "@/repositories"
import { useFileTreeStore } from "@/store/fileTreeStore"
import { formatTimestamp } from "@/utils/dateFormatter"

interface TrashState {
  items: TrashItemData[]
  isBatchMode: boolean
  selectedIds: Set<string>
  loading: boolean
  error: string | null

  loadTrash: () => Promise<void>
  enterBatchMode: (initialItemId?: string) => void
  exitBatchMode: () => void
  toggleSelectItem: (itemId: string) => void
  toggleSelectAll: () => void

  restoreItem: (itemId: string) => Promise<void>
  deletePermanently: (itemId: string) => Promise<void>
  emptyTrash: () => Promise<void>
  batchRestore: () => Promise<void>
  batchDelete: () => Promise<void>
}

export const useTrashStore = create<TrashState>()((set, get) => ({
  items: [],
  isBatchMode: false,
  selectedIds: new Set<string>(),
  loading: true,
  error: null,

  loadTrash: async () => {
    set({ loading: true, error: null })
    try {
      const rawItems = await trashRepo.getTrash()
      const items = rawItems.map((item) => ({
        ...item,
        lastModified: formatTimestamp(item.lastModified),
        createdAt: formatTimestamp(item.createdAt),
      }))
      set({ items, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
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
      if (next.has(itemId)) { next.delete(itemId) } else { next.add(itemId) }
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

  restoreItem: async (itemId: string) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }))
    try {
      await trashRepo.restoreItem(itemId)
      await useFileTreeStore.getState().loadTree()
    } catch {
      get().loadTrash()
    }
  },

  deletePermanently: async (itemId: string) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }))
    try {
      await trashRepo.removeItem(itemId)
    } catch {
      get().loadTrash()
    }
  },

  emptyTrash: async () => {
    set({ items: [] })
    try {
      await trashRepo.clearTrash()
    } catch {
      get().loadTrash()
    }
  },

  batchRestore: async () => {
    const { selectedIds } = get()
    set((state) => ({
      items: state.items.filter((i) => !selectedIds.has(i.id)),
      isBatchMode: false,
      selectedIds: new Set<string>(),
    }))
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => trashRepo.restoreItem(id))
      )
      await useFileTreeStore.getState().loadTree()
    } catch {
      get().loadTrash()
    }
  },

  batchDelete: async () => {
    const { selectedIds } = get()
    set((state) => ({
      items: state.items.filter((i) => !selectedIds.has(i.id)),
      isBatchMode: false,
      selectedIds: new Set<string>(),
    }))
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => trashRepo.removeItem(id))
      )
    } catch {
      get().loadTrash()
    }
  },
}))
