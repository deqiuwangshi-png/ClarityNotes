import { create } from "zustand"
import type { TreeNode, BreadcrumbItem, DocumentInfo, FolderItem } from "@/types/fileTree"
import { fileTreeRepo, trashRepo } from "@/repositories"
import {
  findNode,
  getSiblingNames,
  buildBreadcrumb,
  createNode,
  renameNode as renameNodeService,
  deleteNode as deleteNodeService,
  moveToTrash,
} from "@/lib/services/fileTreeService"
import { validateName } from "@/utils/validator"
import { formatTimestamp } from "@/utils/dateFormatter"

interface FileTreeState {
  tree: TreeNode[]
  selectedNodeId: string | null
  expandedIds: Set<string>
  currentView: "editor" | "folder"
  creatingNodeId: string | null

  selectNode: (id: string) => void
  toggleExpand: (id: string) => void
  createFile: (parentId: string) => void
  createFolder: (parentId: string) => void
  validateCreateName: (nodeId: string, name: string) => string | null
  commitRename: (nodeId: string, newName: string) => void
  cancelCreate: (nodeId: string) => void
  deleteNode: (nodeId: string) => void
  setTree: (tree: TreeNode[]) => void
  restoreFromTrash: (nodeId: string, trashStoreRestore: (id: string, tree: TreeNode[]) => { newTree: TreeNode[]; restoredId?: string } | null) => void
}

export const useFileTreeStore = create<FileTreeState>()((set, get) => ({
  tree: fileTreeRepo.getTree(),
  selectedNodeId: null,
  expandedIds: new Set<string>(),
  currentView: "folder",
  creatingNodeId: null,

  selectNode: (id: string) => {
    const { tree } = get()
    if (id === get().selectedNodeId) return
    const node = findNode(tree, id)
    set({
      selectedNodeId: id,
      currentView: node?.type === "folder" ? "folder" : "editor",
    })
  },

  toggleExpand: (id: string) => {
    set((state) => {
      const next = new Set(state.expandedIds)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return { expandedIds: next }
    })
  },

  createFile: (parentId: string) => {
    const { tree } = get()
    const result = createNode(tree, parentId, "file")
    if ("error" in result) return
    const { newTree, createdNode } = result
    fileTreeRepo.setTree(newTree)
    set({ tree: newTree, selectedNodeId: createdNode.id, creatingNodeId: createdNode.id, currentView: "editor" })
  },

  createFolder: (parentId: string) => {
    const { tree } = get()
    const result = createNode(tree, parentId, "folder")
    if ("error" in result) return
    const { newTree, createdNode } = result
    fileTreeRepo.setTree(newTree)
    set({ tree: newTree, selectedNodeId: createdNode.id, creatingNodeId: createdNode.id, currentView: "folder" })
  },

  validateCreateName: (nodeId: string, name: string) => {
    const { tree } = get()
    const siblingNames = getSiblingNames(tree, nodeId)
    return validateName(name, siblingNames)
  },

  commitRename: (nodeId: string, newName: string) => {
    const { tree } = get()
    const result = renameNodeService(tree, nodeId, newName)
    if ("error" in result) return
    fileTreeRepo.setTree(result.newTree)
    set({ tree: result.newTree, creatingNodeId: null })
  },

  cancelCreate: (nodeId: string) => {
    const { tree, selectedNodeId } = get()
    const deleteResult = deleteNodeService(tree, nodeId)
    if ("error" in deleteResult) return
    fileTreeRepo.setTree(deleteResult.newTree)
    set({
      tree: deleteResult.newTree,
      creatingNodeId: null,
      ...(selectedNodeId === nodeId ? { selectedNodeId: tree[0]?.id ?? null, currentView: "folder" as const } : {}),
    })
  },

  deleteNode: (nodeId: string) => {
    const { tree, selectedNodeId } = get()
    const result = moveToTrash(tree, nodeId)
    if ("error" in result) return
    const { newTree, trashItem } = result
    trashRepo.addToTrash(trashItem)
    fileTreeRepo.setTree(newTree)
    set({
      tree: newTree,
      ...(selectedNodeId === nodeId ? { selectedNodeId: tree[0]?.id ?? null, currentView: "folder" as const } : {}),
    })
  },

  setTree: (tree: TreeNode[]) => {
    fileTreeRepo.setTree(tree)
    set({ tree })
  },

  restoreFromTrash: (nodeId: string, trashStoreRestore) => {
    const { tree, expandedIds } = get()
    const result = trashStoreRestore(nodeId, tree)
    if (!result) return
    fileTreeRepo.setTree(result.newTree)

    const nextExpanded = new Set(expandedIds)
    if (result.restoredId) {
      const parentId = findParentId(result.newTree, result.restoredId)
      if (parentId) nextExpanded.add(parentId)
    }

    set({ tree: result.newTree, selectedNodeId: result.newTree[0]?.id ?? null, currentView: "folder", expandedIds: nextExpanded })
  },
}))

function findParentId(nodes: TreeNode[], childId: string): string | null {
  for (const node of nodes) {
    if (node.children?.some((c) => c.id === childId)) {
      return node.id
    }
    if (node.children) {
      const found = findParentId(node.children, childId)
      if (found) return found
    }
  }
  return null
}

export function useSelectedNode(): TreeNode | null {
  const tree = useFileTreeStore((s) => s.tree)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  if (!selectedNodeId) return tree[0] ?? null
  return findNode(tree, selectedNodeId) ?? tree[0] ?? null
}

export function useFolderItems(): FolderItem[] {
  const tree = useFileTreeStore((s) => s.tree)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  const node = selectedNodeId ? findNode(tree, selectedNodeId) : tree[0]
  if (!node || node.type !== "folder" || !node.children) return []
  return node.children.map((child) => ({
    id: child.id,
    name: child.name,
    type: child.type as "folder" | "file",
    lastModified: child.updatedAt ?? formatTimestamp(),
    createdAt: child.createdAt ?? formatTimestamp(),
  }))
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const tree = useFileTreeStore((s) => s.tree)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  if (!selectedNodeId) return []
  return buildBreadcrumb(tree, selectedNodeId)
}

export function useDocumentInfo(): DocumentInfo | null {
  const tree = useFileTreeStore((s) => s.tree)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  if (!selectedNodeId) return null
  const node = findNode(tree, selectedNodeId)
  if (!node || node.type !== "file") return null
  return {
    id: node.id,
    title: node.name,
    content: node.content ?? "",
    createdAt: node.createdAt ?? formatTimestamp(),
    lastModified: node.updatedAt ?? formatTimestamp(),
    isSaved: true,
    wordCount: node.wordCount ?? 0,
  }
}

export function useFolderName(): string {
  const tree = useFileTreeStore((s) => s.tree)
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)
  if (!selectedNodeId) return "我的文档"
  const node = selectedNodeId ? findNode(tree, selectedNodeId) : tree[0]
  return node?.name ?? "我的文档"
}
