import { createClient } from '@/lib/supabase/client'
import type { DocNode } from '@/types/fileTree'
import type { IDocumentRepository, DocumentRow } from '@/repositories/types'

export class SupabaseDocumentRepository implements IDocumentRepository {
  async upsert(fileId: string, content: DocNode, wordCount: number): Promise<string> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('documents')
      .upsert({ file_id: fileId, content, word_count: wordCount }, { onConflict: 'file_id' })
      .select('updated_at')
      .single()

    if (error) throw error
    return data.updated_at
  }

  async getByFileId(fileId: string): Promise<DocumentRow | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('file_id', fileId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return (data as DocumentRow) ?? null
  }
}
