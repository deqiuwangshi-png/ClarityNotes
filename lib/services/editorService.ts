import type { TreeNode, DocNode } from "@/types/fileTree"
import { findNode } from "@/lib/services/fileTreeService"
import { formatTimestamp } from "@/utils/dateFormatter"
import { validateName } from "@/utils/validator"
import { getSiblingNames } from "@/lib/services/fileTreeService"

export function saveContent(
  tree: TreeNode[],
  nodeId: string,
  content: DocNode,
  wordCount: number,
): { tree: TreeNode[] } | { error: string } {
  const newTree = structuredClone(tree)
  const node = findNode(newTree, nodeId)
  if (!node) return { error: "节点不存在" }
  if (node.type !== "file") return { error: "只能保存文件节点" }

  node.content = content
  node.wordCount = wordCount
  node.updatedAt = formatTimestamp()
  return { tree: newTree }
}

export function updateTitle(
  tree: TreeNode[],
  nodeId: string,
  newTitle: string,
): { tree: TreeNode[] } | { error: string } {
  const siblingNames = getSiblingNames(tree, nodeId)
  const error = validateName(newTitle, siblingNames)
  if (error) return { error }

  const newTree = structuredClone(tree)
  const node = findNode(newTree, nodeId)
  if (!node) return { error: "节点不存在" }

  node.name = newTitle.trim()
  node.updatedAt = formatTimestamp()
  return { tree: newTree }
}
