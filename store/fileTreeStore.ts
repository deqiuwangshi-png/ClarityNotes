import { create } from "zustand"
import type { TreeNode } from "@/types/fileTree"
import { fileTreeRepo, supabaseAuthRepo } from "@/repositories"
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
import { DEFAULT_ROOT_ID } from "@/constants/fileTree"

interface FileTreeState {
  _tree: TreeNode[]
  selectedNodeId: string | null
  expandedIds: Set<string>
  currentView: "editor" | "folder"
  creatingNodeId: string | null
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

  /** 公开 selector：获取当前树 */
  getTree: () => TreeNode[]
  /** 公开 selector：获取当前选中节点 */
  getSelectedNode: () => TreeNode | null
}

export const useFileTreeStore = create<FileTreeState>()((set, get) => {
  async function _ensureRealRoot(parentId: string, userId: string): Promise<string | null> {
    if (parentId !== DEFAULT_ROOT_ID) return parentId

    // 检查本地树中是否已有真实根节点（非虚拟 DEFAULT_ROOT_ID）
    const { _tree } = get()
    const realRoot = _tree.find(
      (n) => n.id !== DEFAULT_ROOT_ID && n.level === 1,
    )
    if (realRoot) return realRoot.id

    try {
      // 确保 profile 存在：修复 auth.users 有记录但 profiles 缺失导致的 FK 约束断裂
      await fileTreeRepo.ensureProfile(userId)

      return await fileTreeRepo.insertNode({
        user_id: userId,
        parent_id: null,
        name: "我的文档",
        type: "folder",
        level: 1,
        sort_order: 0,
      })
    } catch {
      // DB 约束（唯一索引 / RLS / trigger）已拒绝 → 重新加载树获取最新状态
      await get().loadTree()
      set({ error: "根节点初始化失败，请刷新页面重试" })
      return null
    }
  }

  async function _createNode(
    parentId: string,
    name: string,
    type: "file" | "folder",
    view: "editor" | "folder",
  ) {
    const session = await supabaseAuthRepo.getSession()
    const userId = session?.id ?? ""

    const realParentId = await _ensureRealRoot(parentId, userId)
    if (realParentId === null) return

    const { _tree } = get()
    const parent = findNode(_tree, parentId)
    const level = parent ? parent.level + 1 : 2
    const sortOrder = parent?.children?.length ?? 0

    try {
      const newId = await fileTreeRepo.insertNode({
        user_id: userId,
        parent_id: realParentId,
        name,
        type,
        level,
        sort_order: sortOrder,
      })

      const newNode: TreeNode = type === "file"
        ? {
            id: newId, name, type: "file", level,
            expanded: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            wordCount: 0,
          }
        : {
            id: newId, name, type: "folder", level,
            expanded: true, children: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

      set((state) => ({
        _tree: addChildToTree(state._tree, realParentId, newNode, parentId === DEFAULT_ROOT_ID),
        selectedNodeId: newId,
        creatingNodeId: newId,
        currentView: view,
      }))
    } catch {
      get().loadTree()
      set({ error: `创建${type === "file" ? "文档" : "文件夹"}失败，请重试` })
    }
  }

  return {
  _tree: [],
  selectedNodeId: null,
  expandedIds: new Set<string>(),
  currentView: "folder",
  creatingNodeId: null,
  loading: true,
  error: null,

  loadTree: async () => {
    set({ loading: true, error: null })
    try {
      const rawTree = await fileTreeRepo.getTree()
      const tree = rawTree.length > 0 ? rawTree : [getDefaultRoot()]
      set({
        _tree: tree,
        loading: false,
        selectedNodeId: tree[0]?.id ?? null,
        expandedIds: new Set(tree[0]?.id ? [tree[0].id] : []),
      })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  selectNode: (id: string) => {
    if (id === get().selectedNodeId) return
    const node = findNode(get()._tree, id)
    set({
      selectedNodeId: id,
      currentView: node?.type === "folder" ? "folder" : "editor",
    })
  },

  toggleExpand: (id: string) => {
    set((state) => {
      const next = new Set(state.expandedIds)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return { expandedIds: next }
    })
  },

  createFile: (parentId: string) => _createNode(parentId, "未命名文档", "file", "editor"),

  createFolder: (parentId: string) => _createNode(parentId, "未命名文件夹", "folder", "folder"),

  validateCreateName: (nodeId: string, name: string) => {
    const { _tree } = get()
    const siblingNames = getSiblingNames(_tree, nodeId)
    return validateName(name, siblingNames)
  },

  commitRename: async (nodeId: string, newName: string) => {
    const { _tree: oldTree } = get()
    const result = renameNodeService(get()._tree, nodeId, newName)
    if ("error" in result) return
    set({ _tree: result.newTree, creatingNodeId: null })

    if (nodeId === DEFAULT_ROOT_ID) return

    try {
      await fileTreeRepo.updateNode(nodeId, { name: newName.trim() })
    } catch {
      set({ _tree: oldTree, error: "重命名失败" })
    }
  },

  cancelCreate: (nodeId: string) => {
    if (nodeId === DEFAULT_ROOT_ID) {
      set({ creatingNodeId: null })
      return
    }

    const { _tree, selectedNodeId } = get()
    const node = findNode(_tree, nodeId)
    if (node && isRootNode(node)) {
      set({ creatingNodeId: null })
      return
    }

    const result = deleteNodeService(_tree, nodeId)
    if ("error" in result) return
    set({
      _tree: result.newTree,
      creatingNodeId: null,
      ...(selectedNodeId === nodeId
        ? { selectedNodeId: _tree[0]?.id ?? null, currentView: "folder" as const }
        : {}),
    })
  },

  deleteNode: async (nodeId: string) => {
    const { _tree } = get()
    const node = findNode(_tree, nodeId)
    if (!node) return

    if (isRootNode(node)) {
      set({ error: "不能删除根节点" })
      return
    }

    const { _tree: currentTree, selectedNodeId } = get()

    const result = moveToTrash(currentTree, nodeId)
    if ("error" in result) return
    const { newTree } = result
    set({
      _tree: newTree,
      ...(selectedNodeId === nodeId
        ? { selectedNodeId: newTree[0]?.id ?? null, currentView: "folder" as const }
        : {}),
    })

    try {
      // RPC 内部递归 CTE 自动收集所有子孙节点，前端只需传根节点 ID
      await fileTreeRepo.moveToTrash([nodeId])
    } catch {
      get().loadTree()
    }
  },

  setTree: (tree: TreeNode[]) => {
    set({ _tree: tree.length > 0 ? tree : [getDefaultRoot()] })
  },

  getTree: () => get()._tree,

  getSelectedNode: () => {
    const { _tree, selectedNodeId } = get()
    if (!selectedNodeId) return _tree[0] ?? null
    return findNode(_tree, selectedNodeId) ?? _tree[0] ?? null
  },
}})
