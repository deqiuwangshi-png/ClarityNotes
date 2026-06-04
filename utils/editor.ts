import type { DocNode } from "@/types/fileTree"

export function extractPlainText(node: DocNode): string {
  if (node.text) return node.text
  if (!node.content) return ""
  return node.content.map(extractPlainText).join("")
}

export function countWords(doc: DocNode | undefined): number {
  if (!doc) return 0
  const text = extractPlainText(doc).trim()
  if (!text) return 0
  return text.split(/\s+/).length
}
