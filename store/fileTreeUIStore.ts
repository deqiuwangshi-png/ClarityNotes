import { create } from "zustand"
import type { TreeNode } from "@/types/fileTree"
import { findNode } from "@/lib/services/fileTreeService"

interface FileTreeUIState {
  selectedNodeId: string | null
  expandedIds: Set<string>
  currentView: "editor" | "folder"
  creatingNodeId: string | null
  lastClickTimestamp: number

  selectNode: (id: string, tree: TreeNode[]) => void
  toggleExpand: (id: string) => void
  setCreatingNodeId: (id: string | null) => void
  setCurrentView: (view: "editor" | "folder") => void
  resetToRoot: (rootId: string | null) => void
  expand: (id: string) => void
}

export const useFileTreeUIStore = create<FileTreeUIState>()((set) => ({
  selectedNodeId: null,
  expandedIds: new Set<string>(),
  currentView: "folder",
  creatingNodeId: null,
  lastClickTimestamp: 0,

  selectNode: (id: string, tree: TreeNode[]) => {
    const node = findNode(tree, id)
    set({
      selectedNodeId: id,
      currentView: node?.type === "folder" ? "folder" : "editor",
      lastClickTimestamp: Date.now(),
    })
  },

  toggleExpand: (id: string) => {
    set((state) => {
      const next = new Set(state.expandedIds)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return { expandedIds: next }
    })
  },

  setCreatingNodeId: (id: string | null) => {
    set({ creatingNodeId: id })
  },

  setCurrentView: (view: "editor" | "folder") => {
    set({ currentView: view })
  },

  resetToRoot: (rootId: string | null) => {
    set({
      selectedNodeId: rootId,
      currentView: "folder",
      expandedIds: rootId ? new Set([rootId]) : new Set<string>(),
    })
  },

  expand: (id: string) => {
    set((state) => {
      if (state.expandedIds.has(id)) return state
      return { expandedIds: new Set(state.expandedIds).add(id) }
    })
  },
}))
