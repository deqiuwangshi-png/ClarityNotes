import type { TreeNode, BreadcrumbItem, TrashItemData } from "@/types/fileTree"
import { DEFAULT_ROOT_ID } from "@/constants/fileTree"
import { formatTimestamp } from "@/utils/dateFormatter"
import { validateName } from "@/utils/validator"

export function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

export function getParent(nodes: TreeNode[], childId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.children) {
      if (node.children.some((c) => c.id === childId)) return node
      const found = getParent(node.children, childId)
      if (found) return found
    }
  }
  return null
}

export function getSiblingNames(nodes: TreeNode[], nodeId: string): string[] {
  const parent = getParent(nodes, nodeId)
  if (!parent || !parent.children) return []
  const node = findNode(nodes, nodeId)
  if (!node) return []
  return parent.children
    .filter((c) => c.id !== nodeId && c.type === node.type)
    .map((c) => c.name)
}

export function buildBreadcrumb(tree: TreeNode[], targetId: string): BreadcrumbItem[] {
  for (const node of tree) {
    if (node.id === targetId) {
      return [{ id: node.id, name: node.name, isLast: true }]
    }
    if (node.children) {
      const nested = buildBreadcrumb(node.children, targetId)
      if (nested.length > 0) {
        return [{ id: node.id, name: node.name, isLast: false }, ...nested]
      }
    }
  }
  return []
}

export function renameNode(
  tree: TreeNode[],
  nodeId: string,
  newName: string,
): { newTree: TreeNode[] } | { error: string } {
  const siblingNames = getSiblingNames(tree, nodeId)
  const error = validateName(newName, siblingNames)
  if (error) return { error }

  const newTree = structuredClone(tree)
  const node = findNode(newTree, nodeId)
  if (!node) return { error: "节点不存在" }
  node.name = newName.trim()
  node.updatedAt = formatTimestamp()
  return { newTree }
}

export function deleteNode(
  tree: TreeNode[],
  nodeId: string,
): { newTree: TreeNode[]; deletedNode: TreeNode } | { error: string } {
  const node = findNode(tree, nodeId)
  if (!node) return { error: "节点不存在" }
  if (tree.length === 1 && tree[0].id === nodeId) return { error: "不能删除根节点" }

  const newTree = structuredClone(tree)
  _removeNodeInPlace(newTree, nodeId)
  return { newTree, deletedNode: structuredClone(node) }
}

export function moveToTrash(
  tree: TreeNode[],
  nodeId: string,
): { newTree: TreeNode[]; trashItem: TrashItemData } | { error: string } {
  const result = deleteNode(tree, nodeId)
  if ("error" in result) return result

  const { newTree, deletedNode } = result
  const now = formatTimestamp()
  const count = deletedNode.type === "folder" ? countDescendants(deletedNode) : undefined

  const trashItem: TrashItemData = {
    id: deletedNode.id,
    type: deletedNode.type,
    name: deletedNode.name,
    lastModified: deletedNode.updatedAt ?? now,
    createdAt: deletedNode.createdAt ?? now,
    ...(count !== undefined ? { count } : {}),
    ...(deletedNode.type === "file" ? { content: deletedNode.content, wordCount: deletedNode.wordCount } : {}),
  }

  return { newTree, trashItem }
}

function _removeNodeInPlace(nodes: TreeNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children) {
      if (_removeNodeInPlace(nodes[i].children!, id)) return true
    }
  }
  return false
}

function countDescendants(node: TreeNode): number {
  if (!node.children) return 0
  let count = node.children.length
  for (const child of node.children) {
    if (child.type === "folder") {
      count += countDescendants(child)
    }
  }
  return count
}

export function getDefaultRoot(): TreeNode {
  return {
    id: DEFAULT_ROOT_ID,
    name: "我的文档",
    type: "folder",
    level: 1,
    expanded: true,
    children: [],
  }
}

/**
 * 判断节点是否为唯一根节点。
 * 单根树中根节点的充要条件：level === 1（由 DB trigger 强制 root.level=1, 非 root.level>=2）
 */
export function isRootNode(node: TreeNode): boolean {
  return node.level === 1
}

export function addChildToTree(
  nodes: TreeNode[],
  parentId: string,
  child: TreeNode,
  replaceRoot: boolean,
): TreeNode[] {
  return nodes.map((n) => {
    if (replaceRoot && n.id === DEFAULT_ROOT_ID && n.type === "folder") {
      return {
        id: parentId,
        name: "我的文档",
        type: "folder" as const,
        level: 1,
        expanded: true,
        children: [child],
      }
    }
    if (n.id === parentId && n.type === "folder") {
      return {
        ...n,
        children: [...(n.children ?? []), child],
      }
    }
    if (n.children) {
      return {
        ...n,
        children: addChildToTree(n.children, parentId, child, replaceRoot),
      }
    }
    return n
  })
}

export function collectDescendantIds(nodes: TreeNode[], rootId: string): string[] {
  const ids: string[] = [rootId]
  const root = findNode(nodes, rootId)
  if (root?.children) {
    for (const child of root.children) {
      ids.push(...collectDescendantIds(nodes, child.id))
    }
  }
  return ids
}
