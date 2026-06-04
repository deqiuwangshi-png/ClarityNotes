import type { DocNode } from "@/types/fileTree"
import { fileTreeRepo, documentRepo } from "@/repositories"

export interface SaveDocumentParams {
  nodeId: string
  title: string
  content: DocNode
  wordCount: number
}

export async function saveDocument(params: SaveDocumentParams): Promise<void> {
  await documentRepo.upsert(params.nodeId, params.content, params.wordCount)
  await fileTreeRepo.updateNode(params.nodeId, { name: params.title })
}
