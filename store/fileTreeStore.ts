import { useRef, useMemo } from "react"
import { useFileTreeDataStore } from "@/store/fileTreeDataStore"
import { useFileTreeUIStore } from "@/store/fileTreeUIStore"
import { useEditorStore } from "@/store/editorStore"
import type { TreeNode } from "@/types/fileTree"
import { findNode } from "@/lib/services/fileTreeService"

/**
 * 兼容层 store：将数据层 (fileTreeDataStore) 与 UI 层 (fileTreeUIStore) 组合，
 * 保持原有 API 不变，供旧代码渐进式迁移。
 *
 * 新代码建议直接导入 useFileTreeDataStore / useFileTreeUIStore。
 */

interface FileTreeStateCompat {
  _tree: TreeNode[]
  selectedNodeId: string | null
  expandedIds: Set<string>
  currentView: "editor" | "folder"
  creatingNodeId: string | null
  lastClickTimestamp: number
  loading: boolean
  error: string | null

  loadTree: () => Promise<void>
  selectNode: (id: string) => void
  toggleExpand: (id: string) => void
  createFile: (parentId: string) => Promise<void>
  createFolder: (parentId: string) => Promise<void>
  validateCreateName: (nodeId: string, name: string) => string | null
  commitRename: (nodeId: string, newName: string) => Promise<void>
  cancelCreate: (nodeId: string) => void
  deleteNode: (nodeId: string) => Promise<void>
  setTree: (tree: TreeNode[]) => void

  getTree: () => TreeNode[]
  getSelectedNode: () => TreeNode | null
}

export const useFileTreeStore = ((selector?: (state: FileTreeStateCompat) => unknown) => {
  const data = useFileTreeDataStore()
  const ui = useFileTreeUIStore()

  // 函数引用稳定化：data/ui 是 Zustand store handle，生命周期内不变
  const fnsRef = useRef<Pick<
    FileTreeStateCompat,
    | "loadTree" | "selectNode" | "toggleExpand"
    | "createFile" | "createFolder" | "validateCreateName"
    | "commitRename" | "cancelCreate" | "deleteNode"
    | "setTree" | "getTree" | "getSelectedNode"
  > | null>(null)

  if (!fnsRef.current) {
    fnsRef.current = {
      loadTree: async () => {
        await data.loadTree()
        const tree = useFileTreeDataStore.getState()._tree
        const rootId = tree[0]?.id ?? null
        ui.resetToRoot(rootId)
      },

      selectNode: (id: string) => {
        const tree = useFileTreeDataStore.getState()._tree
        ui.selectNode(id, tree)
      },

      toggleExpand: (id: string) => {
        ui.toggleExpand(id)
      },

      createFile: async (parentId: string) => {
        const newId = await data.createFile(parentId)
        if (newId) {
          const tree = useFileTreeDataStore.getState()._tree
          ui.setCreatingNodeId(newId)
          ui.selectNode(newId, tree)
          ui.expand(parentId)
        }
      },

      createFolder: async (parentId: string) => {
        const newId = await data.createFolder(parentId)
        if (newId) {
          const tree = useFileTreeDataStore.getState()._tree
          ui.setCreatingNodeId(newId)
          ui.selectNode(newId, tree)
          ui.expand(parentId)
        }
      },

      validateCreateName: (nodeId: string, name: string) => {
        return data.validateCreateName(nodeId, name)
      },

      commitRename: async (nodeId: string, newName: string) => {
        const trimmedName = newName.trim()
        await data.commitRename(nodeId, trimmedName)
        const renamedNode = findNode(useFileTreeDataStore.getState()._tree, nodeId)
        if (renamedNode?.name === trimmedName) {
          useEditorStore.getState().syncTitleFromTreeRename(nodeId, trimmedName)
        }
        ui.setCreatingNodeId(null)
      },

      cancelCreate: (nodeId: string) => {
        const newTree = data.cancelCreate(nodeId)
        const rootId = newTree[0]?.id ?? null
        const wasSelected = ui.selectedNodeId === nodeId
        ui.setCreatingNodeId(null)
        if (wasSelected) {
          ui.resetToRoot(rootId)
        }
      },

      deleteNode: async (nodeId: string) => {
        const editor = useEditorStore.getState()
        if (editor.loadedNodeId === nodeId && editor.isDirty) {
          await editor.performSave(nodeId)
          const latestEditor = useEditorStore.getState()
          if (latestEditor.loadedNodeId === nodeId && latestEditor.isDirty) return
        }
        await data.deleteNode(nodeId)
        const tree = useFileTreeDataStore.getState()._tree
        const rootId = tree[0]?.id ?? null
        if (ui.selectedNodeId === nodeId) {
          ui.resetToRoot(rootId)
        }
      },

      setTree: (tree: TreeNode[]) => {
        data.setTree(tree)
      },

      getTree: () => useFileTreeDataStore.getState()._tree,

      getSelectedNode: () => {
        const { _tree } = useFileTreeDataStore.getState()
        const selectedId = useFileTreeUIStore.getState().selectedNodeId
        if (!selectedId) return _tree[0] ?? null
        return findNode(_tree, selectedId) ?? _tree[0] ?? null
      },
    }
  }

  const stableFns = fnsRef.current

  const state = useMemo<FileTreeStateCompat>(() => ({
    _tree: data._tree,
    selectedNodeId: ui.selectedNodeId,
    expandedIds: ui.expandedIds,
    currentView: ui.currentView,
    creatingNodeId: ui.creatingNodeId,
    lastClickTimestamp: ui.lastClickTimestamp,
    loading: data.loading,
    error: data.error,

    loadTree: stableFns.loadTree,
    selectNode: stableFns.selectNode,
    toggleExpand: stableFns.toggleExpand,
    createFile: stableFns.createFile,
    createFolder: stableFns.createFolder,
    validateCreateName: stableFns.validateCreateName,
    commitRename: stableFns.commitRename,
    cancelCreate: stableFns.cancelCreate,
    deleteNode: stableFns.deleteNode,
    setTree: stableFns.setTree,
    getTree: stableFns.getTree,
    getSelectedNode: stableFns.getSelectedNode,
  }), [
    data._tree,
    ui.selectedNodeId,
    ui.expandedIds,
    ui.currentView,
    ui.creatingNodeId,
    ui.lastClickTimestamp,
    data.loading,
    data.error,
    stableFns,
  ])

  return selector ? selector(state) : state
}) as {
  (): FileTreeStateCompat
  <T>(selector: (state: FileTreeStateCompat) => T): T
}
