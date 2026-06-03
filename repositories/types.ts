import type { User, RegisterPayload, AuthResponse } from "@/types/auth"
import type { TreeNode, TrashItemData, DocNode } from "@/types/fileTree"

export interface IUserRepository {
  findUserByEmail(email: string): User | undefined
  findUserCredentials(email: string, password: string): (User & { password: string }) | undefined
  getPasswordForUser(userId: string): string | undefined
  updatePassword(userId: string, newPassword: string): void
  addUser(user: User & { password: string }): void
}

export interface ISupabaseAuthRepository {
  signIn(email: string, password: string): Promise<AuthResponse>
  signUp(payload: RegisterPayload): Promise<AuthResponse>
  signOut(): Promise<void>
  getSession(): Promise<User | null>
  onAuthStateChange(callback: (user: User | null) => void): () => void
  updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }>
  updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }>
  getRecentSearches(): string[]
  addRecentSearch(term: string): string[]
  removeRecentSearch(term: string): string[]
}

// ── 实际数据库行类型（匹配 1.sql / docs/1.sql） ──

/** public.file_tree 行 */
export interface FileTreeRow {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  type: "folder" | "file"
  level: number
  sort_order: number
  created_at: string
  updated_at: string
}

/** public.documents 行 */
export interface DocumentRow {
  id: string
  file_id: string
  content: DocNode
  word_count: number
  created_at: string
  updated_at: string
}

/** public.trash 行 */
export interface TrashRow {
  id: string
  user_id: string
  original_id: string
  name: string
  type: "folder" | "file"
  parent_id: string | null
  original_level: number
  content: DocNode | null
  word_count: number
  original_created_at: string
  original_updated_at: string
  deleted_at: string
  expires_at: string
}

/** getTree() 查询结果：file_tree LEFT JOIN documents */
export interface FileTreeWithContent extends FileTreeRow {
  documents: { content: DocNode | null; word_count: number | null } | null
  doc_content: DocNode | null
  doc_word_count: number | null
}

// ── Repository 接口 ──

export interface IFileTreeRepository {
  getTree(): Promise<TreeNode[]>
  ensureProfile(userId: string): Promise<void>
  insertNode(params: {
    user_id: string
    parent_id: string | null
    name: string
    type: "folder" | "file"
    level: number
    sort_order: number
  }): Promise<string>
  updateNode(id: string, updates: { name?: string }): Promise<void>
  upsertDocument(fileId: string, content: DocNode, wordCount: number, expectedUpdatedAt?: string): Promise<void>
  moveToTrash(nodeIds: string[]): Promise<void>
}

export interface ITrashRepository {
  getTrash(): Promise<TrashItemData[]>
  restoreItem(id: string): Promise<void>
  removeItem(id: string): Promise<void>
  clearTrash(): Promise<void>
}

export interface ISessionRepository {
  createSession(user: User, rememberMe?: boolean): void
  updateSessionUser(user: User): void
  clearSession(): void
  getCurrentUser(): User | null
  clearAllData(): void
  getRecentSearches(): string[]
  setRecentSearches(searches: string[]): void
}
