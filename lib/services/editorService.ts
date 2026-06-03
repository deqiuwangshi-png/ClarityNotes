import type { DocNode } from "@/types/fileTree"
import { fileTreeRepo } from "@/repositories"

export interface SaveDocumentParams {
  nodeId: string
  title: string
  content: DocNode
  wordCount: number
  expectedUpdatedAt?: string
}

export async function saveDocument(params: SaveDocumentParams): Promise<void> {
  await fileTreeRepo.updateNode(params.nodeId, { name: params.title })
  await fileTreeRepo.upsertDocument(params.nodeId, params.content, params.wordCount, params.expectedUpdatedAt)
}
