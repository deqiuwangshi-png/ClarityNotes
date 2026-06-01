import type { TreeNode, TrashItemData } from "@/types/fileTree"
import { removeFromTrash, clearTrash as clearTrashData } from "@/data/mockTrash"
import { generateId } from "@/utils/idGenerator"
import { formatTimestamp } from "@/utils/dateFormatter"

export function restoreItem(
  trashItem: TrashItemData,
  tree: TreeNode[],
  targetParentId?: string,
): { newTree: TreeNode[]; restoredId: string } | { error: string } {
  const parentId = targetParentId ?? tree[0]?.id
  if (!parentId) return { error: "无法找到根目录" }

  const newTree = structuredClone(tree)
  const parent = findNodeInClone(newTree, parentId)
  if (!parent) return { error: "目标父节点不存在" }
  if (!parent.children) parent.children = []

  const now = formatTimestamp()
  const restoredNode: TreeNode = {
    id: generateId(),
    name: trashItem.name,
    type: trashItem.type,
    level: parent.level + 1,
    expanded: false,
    createdAt: trashItem.createdAt,
    updatedAt: now,
    ...(trashItem.type === "folder" ? { children: [] } : { wordCount: 0 }),
  }

  parent.children.push(restoredNode)
  parent.expanded = true

  removeFromTrash(trashItem.id)

  return { newTree, restoredId: restoredNode.id }
}

export function deletePermanently(trashId: string): void {
  removeFromTrash(trashId)
}

export function emptyTrash(): void {
  clearTrashData()
}

export function batchRestore(
  items: TrashItemData[],
  tree: TreeNode[],
): { newTree: TreeNode[]; restoredIds: string[] } {
  let currentTree = tree
  const restoredIds: string[] = []

  for (const item of items) {
    const result = restoreItem(item, currentTree)
    if (!("error" in result)) {
      currentTree = result.newTree
      restoredIds.push(result.restoredId)
    }
  }

  return { newTree: currentTree, restoredIds }
}

export function batchDelete(ids: string[]): void {
  for (const id of ids) {
    removeFromTrash(id)
  }
}

function findNodeInClone(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeInClone(node.children, id)
      if (found) return found
    }
  }
  return null
}
