import { createClient } from '@/lib/supabase/client'
import type { User, RegisterPayload, AuthResponse } from '@/types/auth'
import type { ISupabaseAuthRepository } from '@/repositories/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const SEARCH_RECENT_KEY = 'claritynotes_recent_searches'
const MAX_RECENT = 5

export class SupabaseAuthRepository implements ISupabaseAuthRepository {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      return { success: false, error: error?.message || '登录失败，请重试' }
    }

    return { success: true, user: this.mapUser(data.user) }
  }

  async signUp(payload: RegisterPayload): Promise<AuthResponse> {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: { full_name: payload.fullName },
      },
    })

    if (error || !data.user) {
      if (error?.message?.includes('already registered')) {
        return { success: false, error: '该邮箱已被注册' }
      }
      return { success: false, error: error?.message || '注册失败，请重试' }
    }

    return { success: true, user: this.mapUser(data.user) }
  }

  async signOut(): Promise<void> {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  async getSession(): Promise<User | null> {
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    if (!data.session?.user) return null
    return this.mapUser(data.session.user)
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const supabase = createClient()
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ? this.mapUser(session.user) : null)
    })
    return () => data.subscription.unsubscribe()
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    const data: Record<string, unknown> = {}
    if (updates.fullName !== undefined) data.full_name = updates.fullName
    if (updates.avatar !== undefined) data.avatar = updates.avatar
    if (updates.phone !== undefined) data.phone = updates.phone

    const { error } = await supabase.auth.updateUser({ data })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  getRecentSearches(): string[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(SEARCH_RECENT_KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  }

  addRecentSearch(term: string): string[] {
    if (typeof window === 'undefined') return [term]
    const current = this.getRecentSearches()
    const updated = [term, ...current.filter((r) => r !== term)].slice(0, MAX_RECENT)
    try {
      localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(updated))
    } catch {
      /* ignore quota */
    }
    return updated
  }

  removeRecentSearch(term: string): string[] {
    if (typeof window === 'undefined') return []
    const updated = this.getRecentSearches().filter((r) => r !== term)
    try {
      localStorage.setItem(SEARCH_RECENT_KEY, JSON.stringify(updated))
    } catch {
      /* ignore quota */
    }
    return updated
  }

  private mapUser(supabaseUser: SupabaseUser): User {
    const metadata = supabaseUser.user_metadata ?? {}
    return {
      id: supabaseUser.id,
      uid: metadata.uid ?? supabaseUser.id.slice(0, 8),
      email: supabaseUser.email ?? '',
      phone: metadata.phone ?? undefined,
      fullName: metadata.full_name ?? '',
      avatar: (metadata.full_name as string)?.charAt(0) ?? '用',
      membership: metadata.membership ?? 'free',
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at ?? supabaseUser.created_at,
    }
  }
}
