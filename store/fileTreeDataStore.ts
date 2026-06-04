import { create } from "zustand"
import type { TreeNode } from "@/types/fileTree"
import { fileTreeRepo } from "@/repositories"
import {
  findNode,
  getSiblingNames,
  renameNode as renameNodeService,
  deleteNode as deleteNodeService,
  moveToTrash,
  getDefaultRoot,
  isRootNode,
  addChildToTree,
} from "@/lib/services/fileTreeService"
import { validateName } from "@/utils/validator"
import { createNodeOrchestrator } from "@/lib/services/fileTreeOrchestrator"

interface FileTreeDataState {
  _tree: TreeNode[]
  loading: boolean
  error: string | null

  loadTree: () => Promise<void>
  setTree: (tree: TreeNode[]) => void
  createFile: (parentId: string) => Promise<string | null>
  createFolder: (parentId: string) => Promise<string | null>
  validateCreateName: (nodeId: string, name: string) => string | null
  commitRename: (nodeId: string, newName: string) => Promise<void>
  cancelCreate: (nodeId: string) => TreeNode[]
  deleteNode: (nodeId: string) => Promise<void>

  /** 公开 selector */
  getTree: () => TreeNode[]
  getSelectedNode: (selectedNodeId: string | null) => TreeNode | null
}

export const useFileTreeDataStore = create<FileTreeDataState>()((set, get) => ({
  _tree: [],
  loading: true,
  error: null,

  loadTree: async () => {
    set({ loading: true, error: null })
    try {
      const rawTree = await fileTreeRepo.getTree()
      const tree = rawTree.length > 0 ? rawTree : [getDefaultRoot()]
      set({ _tree: tree, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  setTree: (tree: TreeNode[]) => {
    set({ _tree: tree.length > 0 ? tree : [getDefaultRoot()] })
  },

  createFile: async (parentId: string) => {
    const result = await createNodeOrchestrator({
      parentId,
      type: "file",
      getTree: () => get()._tree,
      setTree: (tree) => set({ _tree: tree }),
      onError: (msg) => set({ error: msg }),
    })
    return result?.newNodeId ?? null
  },

  createFolder: async (parentId: string) => {
    const result = await createNodeOrchestrator({
      parentId,
      type: "folder",
      getTree: () => get()._tree,
      setTree: (tree) => set({ _tree: tree }),
      onError: (msg) => set({ error: msg }),
    })
    return result?.newNodeId ?? null
  },

  validateCreateName: (nodeId: string, name: string) => {
    const { _tree } = get()
    const siblingNames = getSiblingNames(_tree, nodeId)
    return validateName(name, siblingNames)
  },

  commitRename: async (nodeId: string, newName: string) => {
    const { _tree: oldTree } = get()
    const result = renameNodeService(get()._tree, nodeId, newName)
    if ("error" in result) return
    set({ _tree: result.newTree })

    try {
      await fileTreeRepo.updateNode(nodeId, { name: newName.trim() })
    } catch {
      set({ _tree: oldTree, error: "重命名失败" })
    }
  },

  cancelCreate: (nodeId: string) => {
    const { _tree } = get()
    const node = findNode(_tree, nodeId)
    if (!node || isRootNode(node)) {
      return _tree
    }
    const result = deleteNodeService(_tree, nodeId)
    if ("error" in result) return _tree
    set({ _tree: result.newTree })
    return result.newTree
  },

  deleteNode: async (nodeId: string) => {
    const { _tree } = get()
    const node = findNode(_tree, nodeId)
    if (!node) return
    if (isRootNode(node)) {
      set({ error: "不能删除根节点" })
      return
    }

    const result = moveToTrash(_tree, nodeId)
    if ("error" in result) return
    set({ _tree: result.newTree })

    try {
      await fileTreeRepo.moveToTrash([nodeId])
    } catch {
      get().loadTree()
    }
  },

  getTree: () => get()._tree,

  getSelectedNode: (selectedNodeId: string | null) => {
    const { _tree } = get()
    if (!selectedNodeId) return _tree[0] ?? null
    return findNode(_tree, selectedNodeId) ?? _tree[0] ?? null
  },
}))
