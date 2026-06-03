'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, RegisterPayload } from '@/types/auth'
import { supabaseAuthRepo } from '@/repositories'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  logoutAndClear: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  changePassword: (newPassword: string) => Promise<boolean>
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

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    logoutAndClear,
    updateUser,
    changePassword,
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
