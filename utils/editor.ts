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

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  const debounced = ((...args: unknown[]) => {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn(...args)
    }, delay)
  }) as T & { cancel: () => void }
  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }
  return debounced
}
