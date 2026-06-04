'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, RegisterPayload } from '@/types/auth'
import { supabaseAuthRepo } from '@/repositories'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>
  logout: () => Promise<void>
  logoutAndClear: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  updateUser: (updates: Partial<User>) => Promise<void>
  changePassword: (newPassword: string) => Promise<boolean>
  updateEmail: (newEmail: string) => Promise<{ success: boolean; error?: string }>
  uploadAvatar: (file: File) => Promise<{ url: string; error?: string }>
  deleteAccount: () => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  authError: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    supabaseAuthRepo.getSession().then((sessionUser) => {
      if (mounted) {
        setUser(sessionUser)
        setIsLoading(false)
      }
    })

    const unsubscribe = supabaseAuthRepo.onAuthStateChange((authUser) => {
      if (mounted) {
        setUser(authUser)
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null)
    setIsLoading(true)
    try {
      const result = await supabaseAuthRepo.signIn(email, password)
      if (result.success) {
        setUser(result.user)
        return { success: true }
      }
      setAuthError(result.error)
      return { success: false, error: result.error }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    setAuthError(null)
    setIsLoading(true)
    try {
      const result = await supabaseAuthRepo.signUp(payload)
      if (result.success) {
        setUser(result.user)
        return { success: true }
      }
      setAuthError(result.error)
      return { success: false, error: result.error }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signInWithOAuth = useCallback(async (provider: 'google' | 'apple') => {
    await supabaseAuthRepo.signInWithOAuth(provider)
  }, [])

  const logout = useCallback(async () => {
    setAuthError(null)
    await supabaseAuthRepo.signOut()
    setUser(null)
  }, [])

  const logoutAndClear = useCallback(async () => {
    setAuthError(null)
    await supabaseAuthRepo.signOut()
    setUser(null)
  }, [])

  const sendPasswordReset = useCallback(async (email: string) => {
    setAuthError(null)
    const result = await supabaseAuthRepo.sendPasswordReset(email)
    if (!result.success) {
      setAuthError(result.error!)
    }
    return result
  }, [])

  const clearError = useCallback(() => {
    setAuthError(null)
  }, [])

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      return { ...prev, ...updates }
    })
    await supabaseAuthRepo.updateProfile(updates)
  }, [])

  const changePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    const result = await supabaseAuthRepo.updatePassword(newPassword)
    return result.success
  }, [])

  const updateEmail = useCallback(async (newEmail: string) => {
    const result = await supabaseAuthRepo.updateEmail(newEmail)
    if (result.success) {
      setUser((prev) => {
        if (!prev) return prev
        return { ...prev, email: newEmail }
      })
    }
    return result
  }, [])

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) return { url: '', error: '未登录' }
    const result = await supabaseAuthRepo.uploadAvatar(user.id, file)
    if (result.url) {
      setUser((prev) => {
        if (!prev) return prev
        return { ...prev, avatar: result.url }
      })
    }
    return result
  }, [user])

  const deleteAccount = useCallback(async () => {
    if (!user) {
      return { success: false, error: '未登录' }
    }
    const result = await supabaseAuthRepo.deleteAccount(user.id)
    if (result.success) {
      await supabaseAuthRepo.signOut()
      setUser(null)
    }
    return result
  }, [user])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    signInWithOAuth,
    logout,
    logoutAndClear,
    sendPasswordReset,
    updateUser,
    changePassword,
    updateEmail,
    uploadAvatar,
    deleteAccount,
    clearError,
    authError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
