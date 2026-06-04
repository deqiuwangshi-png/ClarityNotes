import { createClient } from '@/lib/supabase/client'
import type { User, RegisterPayload, AuthResponse } from '@/types/auth'
import type { ISupabaseAuthRepository, UserSession } from '@/repositories/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

function generateUid(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(4)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

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
    const uid = generateUid()

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName,
          uid,
        },
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

  async signInWithOAuth(provider: 'google' | 'apple'): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/workspace`,
      },
    })
    if (error) throw error
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

  async sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
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

    // 1. 更新 Supabase Auth user_metadata
    const metaData: Record<string, unknown> = {}
    if (updates.fullName !== undefined) metaData.full_name = updates.fullName
    if (updates.avatar !== undefined) metaData.avatar = updates.avatar
    if (updates.phone !== undefined) metaData.phone = updates.phone

    if (Object.keys(metaData).length > 0) {
      const { error: authError } = await supabase.auth.updateUser({ data: metaData })
      if (authError) {
        return { success: false, error: authError.message }
      }
    }

    // 2. 同步到 public.profiles
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const profileData: Record<string, unknown> = {}
      if (updates.fullName !== undefined) profileData.full_name = updates.fullName
      if (updates.avatar !== undefined) profileData.avatar = updates.avatar
      if (updates.phone !== undefined) profileData.phone = updates.phone

      if (Object.keys(profileData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)

        if (profileError) {
          console.error('Failed to sync profiles:', profileError.message)
        }
      }
    }

    return { success: true }
  }

  async deleteAccount(userId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    const { error } = await supabase.rpc('delete_user_account', {
      target_user_id: userId,
    })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  }

  async updateEmail(newEmail: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) {
      return { success: false, error: error.message }
    }
    // 同步到 profiles
    await supabase.from('profiles').update({ email: newEmail }).eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
    return { success: true }
  }

  async uploadAvatar(userId: string, file: File): Promise<{ url: string; error?: string }> {
    const supabase = createClient()
    const ext = file.name.split('.').pop() ?? 'png'
    const filePath = `${userId}/avatar_${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('touxiang')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      return { url: '', error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('touxiang')
      .getPublicUrl(filePath)

    // 更新 profiles.avatar
    await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', userId)
    // 更新 auth metadata
    await supabase.auth.updateUser({ data: { avatar: publicUrl } })

    return { url: publicUrl }
  }

  async getSessions(): Promise<UserSession[]> {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_user_sessions')
    if (error || !data) return []
    return (data as Array<{
      id: string
      user_agent: string | null
      ip: string | null
      created_at: string
      updated_at: string
      is_current: boolean
    }>).map((s) => ({
      id: s.id,
      userAgent: s.user_agent,
      ip: s.ip,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      isCurrent: s.is_current,
    }))
  }

  async removeSession(sessionId: string): Promise<void> {
    const supabase = createClient()
    await supabase.rpc('remove_user_session', { session_id: sessionId })
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
