import type { TreeNode, SearchResultItem, DocNode } from "@/types/fileTree"
import { buildBreadcrumb } from "@/lib/services/fileTreeService"
import { extractPlainText } from "@/utils/editor"

function collectFiles(nodes: TreeNode[]): TreeNode[] {
  const files: TreeNode[] = []
  for (const node of nodes) {
    if (node.type === "file") {
      files.push(node)
    }
    if (node.children) {
      files.push(...collectFiles(node.children))
    }
  }
  return files
}

export function searchNodes(tree: TreeNode[], query: string): SearchResultItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const allFiles = collectFiles(tree)
  const results: SearchResultItem[] = []

  for (const file of allFiles) {
    const title = file.name.toLowerCase()
    if (!title.includes(q)) continue

    const snippet = extractSnippet(file.content, q)
    const fullPath = buildBreadcrumb(tree, file.id)
    const path = fullPath.length > 1 ? fullPath.slice(0, -1) : fullPath

    results.push({
      nodeId: file.id,
      title: file.name,
      path,
      snippet,
    })
  }

  return results
}

export function extractSnippet(doc: DocNode | undefined, query: string): string {
  if (!doc) return ""
  const q = query.trim()
  if (!q) return ""

  const plainText = extractPlainText(doc)
  const idx = plainText.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return plainText.slice(0, 50)

  const maxLen = 50
  const half = Math.floor((maxLen - q.length) / 2)
  const start = Math.max(0, idx - half)
  const end = Math.min(plainText.length, idx + q.length + half)

  let snippet = plainText.slice(start, end)
  if (start > 0) snippet = "..." + snippet
  if (end < plainText.length) snippet = snippet + "..."

  return snippet
}
