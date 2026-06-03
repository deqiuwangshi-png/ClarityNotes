import { createClient } from '@/lib/supabase/client'
import type { TrashItemData } from '@/types/fileTree'
import type { ITrashRepository, TrashRow } from '@/repositories/types'

export class SupabaseTrashRepository implements ITrashRepository {
  async getTrash(): Promise<TrashItemData[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('trash')
      .select('*')
      .order('deleted_at', { ascending: false })

    if (error) throw error
    return (data as TrashRow[]).map(toTrashItem)
  }

  async restoreItem(originalId: string): Promise<void> {
    const supabase = createClient()
    const { data: row, error: fetchErr } = await supabase
      .from('trash')
      .select('*')
      .eq('original_id', originalId)
      .single()

    if (fetchErr || !row) throw fetchErr ?? new Error('Trash item not found')

    const item = row as TrashRow

    // 恢复：插入回 file_tree
    const { error: insertErr } = await supabase
      .from('file_tree')
      .insert({
        id: item.original_id,
        user_id: item.user_id,
        parent_id: item.parent_id,
        name: item.name,
        type: item.type,
        level: item.original_level,
        sort_order: 0,
      })

    if (insertErr) throw insertErr

    // 如果是文件且有内容，恢复 documents
    if (item.type === 'file' && item.content) {
      await supabase
        .from('documents')
        .upsert({
          file_id: item.original_id,
          content: item.content,
          word_count: item.word_count,
        }, { onConflict: 'file_id' })
    }

    // 从 trash 中删除
    const { error: deleteErr } = await supabase
      .from('trash')
      .delete()
      .eq('original_id', originalId)

    if (deleteErr) throw deleteErr
  }

  async removeItem(originalId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('trash')
      .delete()
      .eq('original_id', originalId)
    if (error) throw error
  }

  async clearTrash(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('trash')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) throw error
  }
}

function toTrashItem(row: TrashRow): TrashItemData {
  return {
    id: row.original_id,
    type: row.type,
    name: row.name,
    lastModified: row.original_updated_at,
    createdAt: row.original_created_at,
    wordCount: row.word_count,
  }
}
