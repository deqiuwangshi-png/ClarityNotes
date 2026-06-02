'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, RegisterPayload } from '@/types/auth'
import {
  validateLogin,
  validateRegister,
  createSession,
  clearSession,
  getCurrentUser,
} from '@/lib/services/auth-service'
import { updateUserInfo, clearAllUserData } from '@/lib/services/userService'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>
  logout: (clearAll?: boolean) => void
  updateUser: (updates: Partial<User>) => void
  clearError: () => void
  authError: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser())
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    setAuthError(null)
    setIsLoading(true)
    try {
      const result = await new Promise<{ success: boolean; error?: string; user?: User }>((resolve) => {
        setTimeout(() => {
          resolve(validateLogin(email, password))
        }, 800)
      })
      if (result.success && result.user) {
        setUser(result.user)
        createSession(result.user, rememberMe)
        return { success: true }
      }
      const errorMsg = result.error || '登录失败，请重试'
      setAuthError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    setAuthError(null)
    setIsLoading(true)
    try {
      const result = await new Promise<{ success: boolean; error?: string; user?: User }>((resolve) => {
        setTimeout(() => {
          resolve(validateRegister(payload))
        }, 800)
      })
      if (result.success && result.user) {
        setUser(result.user)
        createSession(result.user)
        return { success: true }
      }
      const errorMsg = result.error || '注册失败，请重试'
      setAuthError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback((clearAll = false) => {
    setAuthError(null)
    if (clearAll) {
      clearAllUserData()
    } else {
      clearSession()
    }
    setUser(null)
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      return updateUserInfo(prev, updates)
    })
  }, [])

  const clearError = useCallback(() => {
    setAuthError(null)
  }, [])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
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
