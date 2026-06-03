import { createClient } from '@/lib/supabase/client'
import type { TreeNode, DocNode } from '@/types/fileTree'
import type { IFileTreeRepository, FileTreeWithContent } from '@/repositories/types'

export class SupabaseFileTreeRepository implements IFileTreeRepository {
  async getTree(): Promise<TreeNode[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('file_tree')
      .select('*, documents(content, word_count)')
      .order('sort_order', { ascending: true })

    if (error) throw error

    const rows = (data as Array<FileTreeWithContent>).map(normalizeJoin)
    return buildTree(rows)
  }

  async ensureProfile(userId: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.rpc('ensure_profile', { target_user_id: userId })
    if (error) throw error
  }

  async insertNode(params: {
    user_id: string
    parent_id: string | null
    name: string
    type: 'folder' | 'file'
    level: number
    sort_order: number
  }): Promise<string> {
    const supabase = createClient()

    // 前端防御：禁止为已有根节点的用户创建第二个根
    if (params.parent_id === null) {
      const { data: existing } = await supabase
        .from('file_tree')
        .select('id')
        .eq('user_id', params.user_id)
        .is('parent_id', null)
        .maybeSingle()

      if (existing) {
        throw new Error('根节点已存在，不允许创建第二个根')
      }
    }

    const { data, error } = await supabase
      .from('file_tree')
      .insert(params)
      .select('id')
      .single()

    if (error) throw error
    return data.id
  }

  async updateNode(id: string, updates: { name?: string }): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('file_tree')
      .update(updates)
      .eq('id', id)
    if (error) throw error
  }

  async upsertDocument(fileId: string, content: DocNode, wordCount: number, expectedUpdatedAt?: string): Promise<void> {
    const supabase = createClient()

    if (expectedUpdatedAt) {
      const { data: existing } = await supabase
        .from('documents')
        .select('updated_at')
        .eq('file_id', fileId)
        .single()

      if (existing && existing.updated_at !== expectedUpdatedAt) {
        throw new Error('CONFLICT: 文档已被其他会话修改')
      }
    }

    const { error } = await supabase
      .from('documents')
      .upsert({ file_id: fileId, content, word_count: wordCount }, { onConflict: 'file_id' })
    if (error) throw error
  }

  async moveToTrash(nodeIds: string[]): Promise<void> {
    const supabase = createClient()
    if (nodeIds.length === 0) return

    // 后端校验：禁止删除根节点
    const { data: roots } = await supabase
      .from('file_tree')
      .select('id')
      .in('id', nodeIds)
      .is('parent_id', null)
      .eq('level', 1)

    if (roots && roots.length > 0) {
      throw new Error('不能删除根文件夹')
    }

    // RPC 调用：数据库原子化执行 SELECT → INSERT trash → DELETE CASCADE
    const { error: rpcErr } = await supabase.rpc('move_to_trash', { node_ids: nodeIds })
    if (rpcErr) throw rpcErr
  }
}

/** Supabase join 返回嵌套结构: { ..., documents: { content, word_count } } → 扁平 */
function normalizeJoin(row: FileTreeWithContent): FileTreeWithContent {
  const doc = row.documents as { content: DocNode | null; word_count: number | null } | null
  return {
    ...row,
    doc_content: doc?.content ?? null,
    doc_word_count: doc?.word_count ?? null,
  }
}

function buildTree(flatNodes: FileTreeWithContent[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  const roots: TreeNode[] = []

  for (const n of flatNodes) {
    map.set(n.id, {
      id: n.id,
      name: n.name,
      type: n.type,
      level: n.level,
      expanded: n.type === 'folder' && n.level === 1,
      createdAt: n.created_at ?? undefined,
      updatedAt: n.updated_at ?? undefined,
      wordCount: n.doc_word_count ?? 0,
      content: n.doc_content ?? undefined,
      children: n.type === 'folder' ? [] : undefined,
    } as TreeNode)
  }

  for (const n of flatNodes) {
    const node = map.get(n.id)!
    if (n.parent_id && map.has(n.parent_id)) {
      map.get(n.parent_id)!.children!.push(node)
    } else if (!n.parent_id) {
      roots.push(node)
    }
    // 孤儿节点（parent_id 非空但父节点不存在）：跳过，不提升为根
  }

  // 单根断言：正常情况下每个用户有且仅有一个根节点
  if (roots.length > 1) {
    console.warn(`[buildTree] 检测到 ${roots.length} 个根节点（预期 1 个），已全部保留但可能存在数据问题`)
  }

  return roots
}
