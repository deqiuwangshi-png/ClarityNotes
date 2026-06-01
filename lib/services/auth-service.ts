import type { User, RegisterPayload, AuthResponse } from "@/types/auth"
import { MOCK_USERS, findUserByEmail, addUser } from "@/data/mockUsers"

const SESSION_KEY = 'claritynotes_auth_user'

export function validateLogin(email: string, password: string): AuthResponse {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  )
  if (user) {
    return { success: true, user }
  }
  return { success: false, error: "邮箱或密码错误，请重试" }
}

export function validateRegister(payload: RegisterPayload): AuthResponse {
  const existing = findUserByEmail(payload.email)
  if (existing) {
    return { success: false, error: "该邮箱已被注册" }
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    avatar: payload.fullName.charAt(0),
    membership: "free",
    createdAt: new Date().toISOString(),
  }
  addUser(newUser)
  return { success: true, user: newUser }
}

export function createSession(user: User, rememberMe?: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  if (!rememberMe) {
    sessionStorage.setItem(SESSION_KEY, 'temp')
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      return JSON.parse(stored) as User
    }
  } catch {
    localStorage.removeItem(SESSION_KEY)
  }
  return null
}
