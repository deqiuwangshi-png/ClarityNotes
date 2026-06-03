import { useMemo } from "react"
import type { TreeNode, BreadcrumbItem, DocumentInfo, FolderItem } from "@/types/fileTree"
import { useFileTreeStore } from "@/store/fileTreeStore"
import { findNode, buildBreadcrumb } from "@/lib/services/fileTreeService"
import { formatTimestamp } from "@/utils/dateFormatter"

export function useSelectedNode(): TreeNode | null {
  return useFileTreeStore((s) => s.getSelectedNode())
}

export function useFolderItems(): FolderItem[] {
  const tree = useFileTreeStore((s) => s.getTree())
  const selectedNode = useFileTreeStore((s) => s.getSelectedNode())

  return useMemo(() => {
    const node = selectedNode ?? tree[0]
    if (!node || node.type !== "folder" || !node.children) return []
    return node.children.map((child) => ({
      id: child.id,
      name: child.name,
      type: child.type as "folder" | "file",
      lastModified: formatTimestamp(child.updatedAt),
      createdAt: formatTimestamp(child.createdAt),
    }))
  }, [tree, selectedNode])
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const tree = useFileTreeStore((s) => s.getTree())
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)

  return useMemo(() => {
    if (!selectedNodeId) return []
    return buildBreadcrumb(tree, selectedNodeId)
  }, [tree, selectedNodeId])
}

export function useDocumentInfo(): DocumentInfo | null {
  const tree = useFileTreeStore((s) => s.getTree())
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)

  return useMemo(() => {
    if (!selectedNodeId) return null
    const node = findNode(tree, selectedNodeId)
    if (!node || node.type !== "file") return null
    return {
      id: node.id,
      title: node.name,
      content: node.content ?? {},
      createdAt: formatTimestamp(node.createdAt),
      lastModified: formatTimestamp(node.updatedAt),
      isSaved: true,
      wordCount: node.wordCount ?? 0,
    }
  }, [tree, selectedNodeId])
}

export function useFolderName(): string {
  const tree = useFileTreeStore((s) => s.getTree())
  const selectedNodeId = useFileTreeStore((s) => s.selectedNodeId)

  return useMemo(() => {
    if (!selectedNodeId) return "我的文档"
    const node = selectedNodeId ? findNode(tree, selectedNodeId) : tree[0]
    return node?.name ?? "我的文档"
  }, [tree, selectedNodeId])
}
