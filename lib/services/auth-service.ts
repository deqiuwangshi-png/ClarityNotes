import type { User, RegisterPayload, AuthResponse } from "@/types/auth"
import { userRepo, sessionRepo } from "@/repositories"
import { generateUid } from "@/utils/uid"

export function validateLogin(email: string, password: string): AuthResponse {
  const user = userRepo.MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  )
  if (user) {
    return { success: true, user }
  }
  return { success: false, error: "邮箱或密码错误，请重试" }
}

export function validateRegister(payload: RegisterPayload): AuthResponse {
  const existing = userRepo.findUserByEmail(payload.email)
  if (existing) {
    return { success: false, error: "该邮箱已被注册" }
  }
  const newUser: User = {
    id: `user-${Date.now()}`,
    uid: generateUid(),
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    avatar: payload.fullName.charAt(0),
    membership: "free",
    createdAt: new Date().toISOString(),
  }
  userRepo.addUser(newUser)
  return { success: true, user: newUser }
}

export function createSession(user: User, rememberMe?: boolean): void {
  sessionRepo.createSession(user, rememberMe)
}

export function clearSession(): void {
  sessionRepo.clearSession()
}

export function getCurrentUser(): User | null {
  return sessionRepo.getCurrentUser()
}
